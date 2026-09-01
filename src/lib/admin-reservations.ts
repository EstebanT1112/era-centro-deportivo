import { courts } from "@/mocks"
import { WEEKDAY_LABELS } from "@/constants/domain"
import { buildWhatsAppUrl as buildMessageUrl } from "@/lib/whatsapp"
import type { Court, PaymentStatus, RecurringReservation, Reservation, ReservationStatus } from "@/types"

export const ADMIN_SCHEDULE_START_TIMES = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"] as const
export const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Mercado Pago", "Tarjeta"] as const
export const WEEKDAYS = WEEKDAY_LABELS

export type ReservationDateFilter = "all" | "today" | "upcoming" | "specific"

export interface ReservationFilters {
  query: string
  dateMode: ReservationDateFilter
  specificDate: string
  courtId: string
  status: "all" | ReservationStatus
  paymentStatus: "all" | PaymentStatus
}

export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("es-AR").replace(/\s+/g, " ")
}

export function getCourtName(courtId: string) {
  return courts.find((court) => court.id === courtId)?.name ?? "Cancha no disponible"
}

export function getReservationOutstandingBalance(reservation: Reservation) {
  const approvedDeposit = reservation.paymentStatus === "approved" ? reservation.depositAmount : 0
  return Math.max(0, reservation.totalAmount - approvedDeposit - reservation.paidBalance)
}

export function filterReservations(items: readonly Reservation[], filters: ReservationFilters, referenceDate: string) {
  const query = normalizeSearch(filters.query)

  return [...items]
    .filter((reservation) => {
      const searchable = normalizeSearch(`${reservation.code} ${reservation.customerName} ${reservation.customerPhone}`)
      const matchesQuery = !query || searchable.includes(query)
      const matchesDate =
        filters.dateMode === "all" ||
        (filters.dateMode === "today" && reservation.date === referenceDate) ||
        (filters.dateMode === "upcoming" && reservation.date > referenceDate) ||
        (filters.dateMode === "specific" && reservation.date === filters.specificDate)
      return matchesQuery && matchesDate &&
        (filters.courtId === "all" || reservation.courtId === filters.courtId) &&
        (filters.status === "all" || reservation.status === filters.status) &&
        (filters.paymentStatus === "all" || reservation.paymentStatus === filters.paymentStatus)
    })
    .sort((a, b) => {
      const aUpcoming = a.date >= referenceDate
      const bUpcoming = b.date >= referenceDate
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1
      const comparison = `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)
      return aUpcoming ? comparison : -comparison
    })
}

export function buildWhatsAppUrl(phone: string, code: string) {
  return buildMessageUrl(phone, `Hola, te contactamos del club por tu reserva ${code}.`)
}

export function addDays(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function addMinutesToTime(time: string, minutes: number) {
  const [hours, currentMinutes] = time.split(":").map(Number)
  const total = hours * 60 + currentMinutes + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

export function getWeekDates(value: string) {
  const date = new Date(`${value}T12:00:00Z`)
  const mondayOffset = date.getUTCDay() === 0 ? -6 : 1 - date.getUTCDay()
  const monday = addDays(value, mondayOffset)
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

export function getReservationForSlot(items: readonly Reservation[], courtId: string, date: string, startTime: string) {
  return items.find((reservation) =>
    reservation.courtId === courtId && reservation.date === date && reservation.startTime === startTime &&
    !["cancelled", "expired"].includes(reservation.status)
  )
}

export function getValidCourtFromQuery(value: string | undefined): Court | undefined {
  return courts.find((court) => court.status === "active" && (court.id === value || court.slug === value))
}

export function validateRecurringReservation(input: Omit<RecurringReservation, "id" | "status">) {
  if (!input.customerName.trim() || !input.customerPhone.trim() || !input.courtId || !input.startTime || !input.startDate || !input.endDate) {
    return "Completá todos los campos obligatorios."
  }
  if (input.endDate < input.startDate) return "La fecha hasta debe ser igual o posterior a la fecha desde."
  if (!ADMIN_SCHEDULE_START_TIMES.includes(input.startTime as (typeof ADMIN_SCHEDULE_START_TIMES)[number])) return "Elegí un horario válido."
  return null
}

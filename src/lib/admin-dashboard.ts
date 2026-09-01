import { MOCK_CURRENT_DATE } from "@/constants/prototype"
import { courts, reservations } from "@/mocks"
import { getMockCourtAvailability } from "@/mocks/court-availability"
import type { Reservation } from "@/types"

function reservationDateTime(reservation: Reservation) {
  return `${reservation.date}T${reservation.startTime}`
}

function sortReservationsAscending(items: readonly Reservation[]) {
  return [...items].sort((a, b) => reservationDateTime(a).localeCompare(reservationDateTime(b)))
}

export function getTodayReservations(referenceDate = MOCK_CURRENT_DATE) {
  return sortReservationsAscending(reservations.filter((reservation) => reservation.date === referenceDate && reservation.status !== "cancelled"))
}

export function getUpcomingReservations(referenceDate = MOCK_CURRENT_DATE, limit = 5) {
  return sortReservationsAscending(
    reservations.filter(
      (reservation) =>
        reservation.date > referenceDate &&
        !["cancelled", "completed", "expired"].includes(reservation.status)
    )
  ).slice(0, limit)
}

export function getRecentlyConfirmedReservations(limit = 4) {
  return [...reservations]
    .filter((reservation) => reservation.status === "confirmed")
    .sort((a, b) => reservationDateTime(b).localeCompare(reservationDateTime(a)))
    .slice(0, limit)
}

export function getCourtAlerts() {
  return courts.filter((court) => court.status === "maintenance" || court.status === "inactive")
}

export function getDashboardSummary(referenceDate = MOCK_CURRENT_DATE) {
  const todayReservations = getTodayReservations(referenceDate)
  const upcomingReservations = getUpcomingReservations(referenceDate)
  const recentlyConfirmedReservations = getRecentlyConfirmedReservations()
  const courtAlerts = getCourtAlerts()
  const availableSlotsToday = courts
    .filter((court) => court.status === "active")
    .flatMap((court) => getMockCourtAvailability(court, [referenceDate])[referenceDate] ?? [])
    .filter((slot) => slot.status === "available").length
  const pendingReservations = reservations.filter((reservation) => reservation.status === "pending_payment").length
  const depositsCollectedToday = reservations
    .filter((reservation) => reservation.date === referenceDate && reservation.paymentStatus === "approved")
    .reduce((total, reservation) => total + reservation.depositAmount, 0)
  const outstandingBalance = reservations
    .filter((reservation) => !["cancelled", "expired"].includes(reservation.status))
    .reduce((total, reservation) => {
      const approvedDeposit = reservation.paymentStatus === "approved" ? reservation.depositAmount : 0
      return total + Math.max(0, reservation.totalAmount - approvedDeposit - reservation.paidBalance)
    }, 0)

  return {
    referenceDate,
    todayReservations,
    upcomingReservations,
    recentlyConfirmedReservations,
    courtAlerts,
    metrics: {
      todayReservations: todayReservations.length,
      upcomingReservations: upcomingReservations.length,
      availableSlotsToday,
      pendingReservations,
      depositsCollectedToday,
      outstandingBalance,
    },
  }
}

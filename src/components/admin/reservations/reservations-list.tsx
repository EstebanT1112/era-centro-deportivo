"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ExternalLinkIcon, MessageCircleIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminRowActions, AdminTableShell } from "@/components/admin/admin-table"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { PAYMENT_STATUSES, RESERVATION_STATUSES } from "@/constants/domain"
import { MOCK_CURRENT_DATE } from "@/constants/prototype"
import { courts } from "@/mocks"
import { buildWhatsAppUrl, filterReservations, type ReservationFilters } from "@/lib/admin-reservations"
import { formatDate } from "@/lib/formatters"
import { getPaymentStatusPresentation, getReservationStatusPresentation } from "@/lib/status-presentations"
import { useAdminReservations } from "./reservations-provider"
import type { PaymentStatus, Reservation, ReservationStatus } from "@/types"

const dateItems = [
  { label: "Todas las fechas", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Próximas", value: "upcoming" },
  { label: "Fecha específica", value: "specific" },
]
const courtItems = [{ label: "Todas las canchas", value: "all" }, ...courts.map((court) => ({ label: court.name, value: court.id }))]
const reservationStatusItems = [{ label: "Todos los estados", value: "all" }, ...RESERVATION_STATUSES]
const paymentStatusItems = [{ label: "Todos los pagos", value: "all" }, ...PAYMENT_STATUSES]

const initialFilters: ReservationFilters = {
  query: "",
  dateMode: "all",
  specificDate: MOCK_CURRENT_DATE,
  courtId: "all",
  status: "all",
  paymentStatus: "all",
}

function ReservationBadges({ reservation }: { reservation: Reservation }) {
  const reservationState = getReservationStatusPresentation(reservation.status)
  const paymentState = getPaymentStatusPresentation(reservation.paymentStatus)
  return (
    <div className="flex flex-wrap gap-1.5">
      <StatusBadge variant={reservationState.variant}>{reservationState.label}</StatusBadge>
      <StatusBadge variant={paymentState.variant}>{paymentState.label}</StatusBadge>
    </div>
  )
}

function ReservationActions({ reservation }: { reservation: Reservation }) {
  return (
    <AdminRowActions label={`Acciones de ${reservation.code}`}>
      <DropdownMenuItem render={<Link href={`/admin/reservas/${reservation.id}`} />}>
        <ExternalLinkIcon aria-hidden="true" /> Ver detalle
      </DropdownMenuItem>
      <DropdownMenuItem render={<a href={buildWhatsAppUrl(reservation.customerPhone, reservation.code)} target="_blank" rel="noopener noreferrer" />}>
        <MessageCircleIcon aria-hidden="true" /> Contactar por WhatsApp
      </DropdownMenuItem>
    </AdminRowActions>
  )
}

function MobileReservationList({ reservations }: { reservations: Reservation[] }) {
  return (
    <ul className="divide-y divide-border" aria-label="Reservas encontradas">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/admin/reservas/${reservation.id}`} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {reservation.code}
              </Link>
              <p className="truncate font-medium">{reservation.customerName}</p>
              <p className="text-sm text-muted-foreground">{reservation.customerPhone}</p>
            </div>
            <ReservationActions reservation={reservation} />
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div><dt className="text-muted-foreground">Fecha y hora</dt><dd className="font-medium tabular-nums">{formatDate(reservation.date)} · {reservation.startTime}</dd></div>
            <div><dt className="text-muted-foreground">Cancha</dt><dd className="font-medium">{courts.find((court) => court.id === reservation.courtId)?.name}</dd></div>
          </dl>
          <ReservationBadges reservation={reservation} />
        </li>
      ))}
    </ul>
  )
}

function ReservationsList() {
  const { reservations } = useAdminReservations()
  const [filters, setFilters] = useState(initialFilters)
  const filtered = useMemo(() => filterReservations(reservations, filters, MOCK_CURRENT_DATE), [filters, reservations])
  const hasFilters = Object.entries(filters).some(([key, value]) => key === "specificDate" ? false : value !== initialFilters[key as keyof ReservationFilters]) || (filters.dateMode === "specific" && filters.specificDate !== MOCK_CURRENT_DATE)
  const setFilter = <K extends keyof ReservationFilters>(key: K, value: ReservationFilters[K]) => setFilters((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex flex-col gap-4">
      <AdminFilterBar
        search={
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={filters.query} onChange={(event) => setFilter("query", event.target.value)} className="pl-9" type="search" aria-label="Buscar reservas" placeholder="Código, cliente o teléfono" />
          </div>
        }
        filters={
          <>
            <Select items={dateItems} value={filters.dateMode} onValueChange={(value) => value && setFilter("dateMode", value as ReservationFilters["dateMode"])}>
              <SelectTrigger aria-label="Filtrar por fecha" className="sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{dateItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            {filters.dateMode === "specific" ? <Input type="date" aria-label="Fecha específica" value={filters.specificDate} onChange={(event) => setFilter("specificDate", event.target.value)} className="sm:w-40" /> : null}
            <Select items={courtItems} value={filters.courtId} onValueChange={(value) => value && setFilter("courtId", value)}>
              <SelectTrigger aria-label="Filtrar por cancha" className="sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{courtItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <Select items={reservationStatusItems} value={filters.status} onValueChange={(value) => value && setFilter("status", value as "all" | ReservationStatus)}>
              <SelectTrigger aria-label="Filtrar por estado de reserva" className="sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{reservationStatusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <Select items={paymentStatusItems} value={filters.paymentStatus} onValueChange={(value) => value && setFilter("paymentStatus", value as "all" | PaymentStatus)}>
              <SelectTrigger aria-label="Filtrar por estado de pago" className="sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{paymentStatusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </>
        }
        resultCount={<span aria-live="polite">{hasFilters ? `${filtered.length} de ${reservations.length} reservas` : `${reservations.length} reservas`}</span>}
        clearAction={hasFilters && filtered.length > 0 ? <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : null}
      />

      {filtered.length ? (
        <AdminTableShell title="Reservas" description="Hoy y próximas primero; luego, el histórico más reciente." mobileFallback={<MobileReservationList reservations={filtered} />}>
          <Table>
            <TableCaption className="sr-only">Reservas con cliente, cancha, fecha, horario y estados.</TableCaption>
            <TableHeader><TableRow>
              <TableHead scope="col">Código</TableHead><TableHead scope="col">Cliente</TableHead><TableHead scope="col">Cancha</TableHead><TableHead scope="col">Fecha</TableHead><TableHead scope="col">Horario</TableHead><TableHead scope="col">Estado</TableHead><TableHead scope="col">Pago</TableHead><TableHead scope="col"><span className="sr-only">Acciones</span></TableHead>
            </TableRow></TableHeader>
            <TableBody>{filtered.map((reservation) => {
              const reservationState = getReservationStatusPresentation(reservation.status)
              const paymentState = getPaymentStatusPresentation(reservation.paymentStatus)
              return <TableRow key={reservation.id}>
                <TableCell><Link className="font-semibold text-primary underline-offset-4 hover:underline" href={`/admin/reservas/${reservation.id}`}>{reservation.code}</Link></TableCell>
                <TableCell><p className="font-medium">{reservation.customerName}</p><p className="text-xs text-muted-foreground">{reservation.customerPhone}</p></TableCell>
                <TableCell>{courts.find((court) => court.id === reservation.courtId)?.name}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(reservation.date)}</TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">{reservation.startTime}–{reservation.endTime}</TableCell>
                <TableCell><StatusBadge variant={reservationState.variant}>{reservationState.label}</StatusBadge></TableCell>
                <TableCell><StatusBadge variant={paymentState.variant}>{paymentState.label}</StatusBadge></TableCell>
                <TableCell className="text-right"><ReservationActions reservation={reservation} /></TableCell>
              </TableRow>
            })}</TableBody>
          </Table>
        </AdminTableShell>
      ) : (
        <EmptyState icon={SlidersHorizontalIcon} title="No encontramos reservas con estos filtros" description="Probá con otros criterios o volvé a ver todas las reservas." titleAs="h2" action={<Button variant="outline" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button>} />
      )}
    </div>
  )
}

export { ReservationsList }

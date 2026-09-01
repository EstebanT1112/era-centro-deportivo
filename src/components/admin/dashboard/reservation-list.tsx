import Link from "next/link"
import { CalendarX2Icon, ChevronRightIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourtById } from "@/lib/mock-selectors"
import { formatShortDate } from "@/lib/formatters"
import { getPaymentStatusPresentation, getReservationStatusPresentation } from "@/lib/status-presentations"
import type { Reservation } from "@/types"

interface ReservationListProps {
  id?: string
  title: string
  description?: string
  reservations: readonly Reservation[]
  showDate?: boolean
  viewAllHref?: string
}

function ReservationList({ id, title, description, reservations, showDate = false, viewAllHref }: ReservationListProps) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader className="border-b border-border">
        <CardTitle><h2>{title}</h2></CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {viewAllHref ? (
          <CardAction>
            <Button variant="link" size="sm" render={<Link href={viewAllHref} />} nativeButton={false}>Ver todas</Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        {reservations.length ? (
          <ul className="divide-y divide-border">
            {reservations.map((reservation) => {
              const court = getCourtById(reservation.courtId)
              const reservationStatus = getReservationStatusPresentation(reservation.status)
              const paymentStatus = getPaymentStatusPresentation(reservation.paymentStatus)

              return (
                <li key={reservation.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:items-center">
                  <div className="flex items-baseline gap-2 sm:flex-col sm:items-start sm:gap-0.5">
                    <time dateTime={`${reservation.date}T${reservation.startTime}`} className="font-heading text-base font-semibold tabular-nums text-foreground">{reservation.startTime}</time>
                    {showDate ? <span className="text-xs text-muted-foreground">{formatShortDate(reservation.date)}</span> : <span className="text-xs text-muted-foreground">{reservation.endTime} fin</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{reservation.customerName}</p>
                    <p className="truncate text-sm text-muted-foreground">{court?.name ?? "Cancha no disponible"} · {reservation.code}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <StatusBadge variant={reservationStatus.variant}>{reservationStatus.label}</StatusBadge>
                    <StatusBadge variant={paymentStatus.variant}>{paymentStatus.label}</StatusBadge>
                    <Button variant="ghost" size="icon-sm" render={<Link href={`/admin/reservas/${reservation.id}`} aria-label={`Ver detalle de ${reservation.code}`} />} nativeButton={false}>
                      <ChevronRightIcon aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={CalendarX2Icon}
              title="No hay reservas para mostrar"
              description="Podés registrar un nuevo turno desde el panel."
              action={<Button size="sm" render={<Link href="/admin/reservas/nueva" />} nativeButton={false}>Nueva reserva</Button>}
              className="min-h-48"
              titleAs="h3"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { ReservationList }

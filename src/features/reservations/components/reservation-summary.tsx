import { CalendarDaysIcon, Clock3Icon, MapPinIcon, ReceiptTextIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { COURT_TYPES } from "@/constants/domain"
import { calculateDeposit } from "@/config/reservations"
import type { ReservationDraft } from "@/features/reservations/types"
import { formatCurrency, formatDate } from "@/lib/formatters"
import type { Court, CourtTimeSlot } from "@/types"

interface ReservationSummaryProps {
  draft: ReservationDraft
  court?: Court
  slot?: CourtTimeSlot
  compact?: boolean
}

function ReservationSummary({ draft, court, slot, compact = false }: ReservationSummaryProps) {
  const courtType = court
    ? COURT_TYPES.find((item) => item.value === court.type)?.label
    : undefined
  const total = court?.pricePerSlot ?? 0
  const deposit = calculateDeposit(total)
  const balance = total - deposit

  return (
    <Card size={compact ? "sm" : "default"}>
      <CardHeader>
        <CardTitle>
          <h2 className="font-display text-h4">Tu reserva</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {court ? (
          <div className="flex gap-3">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">{court.name}</p>
              <p className="text-sm text-muted-foreground">{courtType} · {court.surface}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Seleccioná una cancha para comenzar.</p>
        )}

        {draft.date ? (
          <div className="flex gap-3">
            <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium text-foreground">{formatDate(draft.date)}</p>
            </div>
          </div>
        ) : null}

        {slot ? (
          <div className="flex gap-3">
            <Clock3Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Horario</p>
              <p className="font-medium tabular-nums text-foreground">
                {slot.startTime}–{slot.endTime} h · {court?.slotMinutes} min
              </p>
            </div>
          </div>
        ) : null}

        {court ? (
          <>
            <Separator />
            <div className="flex gap-3">
              <ReceiptTextIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <dl className="grid flex-1 gap-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Precio total</dt>
                  <dd className="font-semibold tabular-nums">{formatCurrency(total)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-semibold text-foreground">Seña ahora</dt>
                  <dd className="font-bold tabular-nums text-primary">{formatCurrency(deposit)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Saldo en el club</dt>
                  <dd className="font-semibold tabular-nums">{formatCurrency(balance)}</dd>
                </div>
              </dl>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { ReservationSummary }

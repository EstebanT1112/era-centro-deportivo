"use client"

import { ArrowLeftIcon, PencilIcon, ShieldCheckIcon, WalletCardsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { COURT_TYPES } from "@/constants/domain"
import { calculateDeposit } from "@/config/reservations"
import type { ReservationDraft, ReservationStep } from "@/features/reservations/types"
import { formatCurrency, formatDate } from "@/lib/formatters"
import type { Court, CourtTimeSlot } from "@/types"

interface SummaryStepProps {
  draft: ReservationDraft
  court: Court
  slot: CourtTimeSlot
  onEdit: (step: ReservationStep) => void
  onBack: () => void
  onPay: () => void
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} aria-label={`Editar ${label}`}>
      <PencilIcon data-icon="inline-start" />
      Editar
    </Button>
  )
}

function SummaryStep({ draft, court, slot, onEdit, onBack, onPay }: SummaryStepProps) {
  const type = COURT_TYPES.find((item) => item.value === court.type)?.label
  const total = court.pricePerSlot
  const deposit = calculateDeposit(total)
  const balance = total - deposit

  return (
    <div className="flex flex-col gap-5">
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h3 className="type-h4">Turno</h3>
          </CardTitle>
          <CardAction>
            <EditButton label="cancha" onClick={() => onEdit("court")} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Cancha</dt>
              <dd className="font-semibold">{court.name}</dd>
              <dd className="text-sm text-muted-foreground">{type} · {court.surface}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Fecha y horario</dt>
              <dd className="font-semibold">{formatDate(draft.date!)}</dd>
              <dd className="text-sm tabular-nums text-muted-foreground">
                {slot.startTime}–{slot.endTime} h · {court.slotMinutes} minutos
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <EditButton label="fecha y horario" onClick={() => onEdit("schedule")} />
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h3 className="type-h4">Datos de contacto</h3>
          </CardTitle>
          <CardAction>
            <EditButton label="datos de contacto" onClick={() => onEdit("customer")} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Nombre</dt>
              <dd className="font-medium">{draft.firstName} {draft.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Teléfono / WhatsApp</dt>
              <dd className="font-medium">{draft.phone}</dd>
            </div>
            {draft.email ? (
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium break-words">{draft.email}</dd>
              </div>
            ) : null}
            {draft.playerCount ? (
              <div>
                <dt className="text-sm text-muted-foreground">Jugadores</dt>
                <dd className="font-medium tabular-nums">{draft.playerCount}</dd>
              </div>
            ) : null}
            {draft.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Observaciones</dt>
                <dd className="text-pretty">{draft.notes}</dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>
            <h3 className="font-display text-h3">Importes</h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Precio total del turno</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(total)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md bg-secondary p-3">
              <dt className="font-bold text-secondary-foreground">Seña a pagar ahora</dt>
              <dd className="text-lg font-bold tabular-nums text-primary">{formatCurrency(deposit)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Saldo pendiente en el club</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(balance)}</dd>
            </div>
          </dl>
          <Separator />
          <p className="flex gap-2 text-sm text-muted-foreground">
            <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            La simulación aprobará únicamente la seña. El saldo queda pendiente para abonar en el club.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Volver a tus datos
        </Button>
        <Button size="lg" onClick={onPay}>
          <WalletCardsIcon data-icon="inline-start" />
          Pagar seña con Mercado Pago
        </Button>
      </div>
    </div>
  )
}

export { SummaryStep }

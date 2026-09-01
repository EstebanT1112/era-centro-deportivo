import Link from "next/link"
import { CheckCircle2Icon, HomeIcon, MessageCircleIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import type { CompletedReservation } from "@/features/reservations/types"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

interface SuccessStepProps {
  result: CompletedReservation
}

function SuccessStep({ result }: SuccessStepProps) {
  const { reservation, court, slot } = result
  const balance = reservation.totalAmount - reservation.depositAmount
  const message = `Hola, tengo la reserva ${reservation.code} para ${court.name}, el ${formatDate(reservation.date)} a las ${slot.startTime} h.`
  const whatsappHref = buildWhatsAppUrl(siteConfig.contact.whatsapp.number, message)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2Icon className="size-10" aria-hidden="true" />
      </span>
      <div className="flex max-w-xl flex-col items-center gap-3">
        <StatusBadge variant="success">Reserva confirmada</StatusBadge>
        <p className="text-pretty text-muted-foreground">
          La seña simulada fue aprobada. Guardá el código para comunicarte con el club.
        </p>
      </div>

      <Card className="w-full max-w-2xl text-left">
        <CardHeader className="border-b border-border pb-5">
          <div>
            <p className="text-sm text-muted-foreground">Código de reserva</p>
            <CardTitle>
              <p className="font-display text-h2 tabular-nums text-primary">{reservation.code}</p>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Cancha</dt>
              <dd className="font-semibold">{court.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Fecha y horario</dt>
              <dd className="font-semibold">{formatDate(reservation.date)}</dd>
              <dd className="text-sm tabular-nums text-muted-foreground">{slot.startTime}–{slot.endTime} h</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Precio total</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(reservation.totalAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Seña abonada</dt>
              <dd className="font-bold tabular-nums text-success">{formatCurrency(reservation.depositAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Saldo pendiente en el club</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(balance)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Estado de la seña</dt>
              <dd className="mt-1"><StatusBadge variant="success">Aprobada</StatusBadge></dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full sm:w-auto")}
        >
          <MessageCircleIcon data-icon="inline-start" />
          Contactar al club por WhatsApp
        </a>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
        >
          <HomeIcon data-icon="inline-start" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export { SuccessStep }

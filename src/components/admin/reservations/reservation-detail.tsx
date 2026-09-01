"use client"

import { useState } from "react"
import Link from "next/link"
import { BanknoteIcon, CalendarDaysIcon, CheckCircle2Icon, Clock3Icon, MessageCircleIcon, PhoneIcon, ReceiptTextIcon, UserRoundIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/toast"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { courts } from "@/mocks"
import { buildWhatsAppUrl, getReservationOutstandingBalance, PAYMENT_METHODS } from "@/lib/admin-reservations"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { getPaymentStatusPresentation, getReservationStatusPresentation } from "@/lib/status-presentations"
import { useAdminReservations } from "./reservations-provider"

const paymentMethodItems = PAYMENT_METHODS.map((method) => ({ label: method, value: method }))

function DetailItem({ icon: Icon, label, children }: { icon: typeof UserRoundIcon; label: string; children: React.ReactNode }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="font-medium">{children}</dd></div></div>
}

function ReservationDetail({ reservationId }: { reservationId: string }) {
  const { reservations, registerPayment, completeReservation } = useAdminReservations()
  const reservation = reservations.find((item) => item.id === reservationId)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]>("Transferencia")
  const [feedback, setFeedback] = useState("")

  if (!reservation) {
    return <EmptyState icon={ReceiptTextIcon} title="Reserva no encontrada" description="La reserva no existe o era temporal y se perdió al actualizar la página." titleAs="h1" action={<Button render={<Link href="/admin/reservas" />} nativeButton={false}>Volver a reservas</Button>} />
  }

  const court = courts.find((item) => item.id === reservation.courtId)
  const reservationState = getReservationStatusPresentation(reservation.status)
  const paymentState = getPaymentStatusPresentation(reservation.paymentStatus)
  const outstanding = getReservationOutstandingBalance(reservation)
  const canComplete = reservation.status === "confirmed"
  const canPay = outstanding > 0 && !["cancelled", "expired"].includes(reservation.status)
  const targetReservationId = reservation.id
  const reservationCode = reservation.code

  function handlePayment() {
    registerPayment(targetReservationId)
    setPaymentOpen(false)
    setFeedback(`Pago registrado mediante ${paymentMethod}.`)
    toast.add({ title: "Pago registrado correctamente", description: `${reservationCode} · ${paymentMethod}`, type: "success" })
  }

  function handleComplete() {
    completeReservation(targetReservationId)
    setFeedback("La reserva fue marcada como finalizada.")
    toast.add({ title: "Reserva finalizada", description: reservationCode, type: "success" })
  }

  return <div className="flex flex-col gap-6">
    <AdminPageHeader
      title={`Reserva ${reservation.code}`}
      description={`${court?.name ?? "Cancha"} · ${formatDate(reservation.date)} · ${reservation.startTime} h`}
      breadcrumbs={[{ label: "Reservas", href: "/admin/reservas" }, { label: reservation.code }]}
      actions={<div className="flex flex-wrap gap-2"><StatusBadge variant={reservationState.variant}>{reservationState.label}</StatusBadge><StatusBadge variant={paymentState.variant}>{paymentState.label}</StatusBadge></div>}
    />

    {feedback ? <p role="status" className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success-foreground">{feedback}</p> : null}

    <div className="grid gap-4 xl:grid-cols-12">
      <div className="grid gap-4 md:grid-cols-2 xl:col-span-8">
        <Card><CardHeader><CardTitle><h2 className="text-base">Cliente</h2></CardTitle><CardDescription>Datos para identificar y contactar.</CardDescription></CardHeader><CardContent><dl className="flex flex-col gap-4">
          <DetailItem icon={UserRoundIcon} label="Nombre">{reservation.customerName}</DetailItem>
          <DetailItem icon={PhoneIcon} label="Teléfono"><a className="underline-offset-4 hover:underline" href={`tel:${reservation.customerPhone}`}>{reservation.customerPhone}</a></DetailItem>
        </dl></CardContent></Card>

        <Card><CardHeader><CardTitle><h2 className="text-base">Turno</h2></CardTitle><CardDescription>Cancha y horario reservado.</CardDescription></CardHeader><CardContent><dl className="flex flex-col gap-4">
          <DetailItem icon={CalendarDaysIcon} label="Cancha y fecha">{court?.name} · {formatDate(reservation.date)}</DetailItem>
          <DetailItem icon={Clock3Icon} label="Horario"><span className="tabular-nums">{reservation.startTime}–{reservation.endTime} h · {court?.slotMinutes} min</span></DetailItem>
        </dl></CardContent></Card>

        <Card className="md:col-span-2"><CardHeader><CardTitle><h2 className="text-base">Pago</h2></CardTitle><CardDescription>El estado del pago y el saldo se muestran por separado.</CardDescription></CardHeader><CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-sm text-muted-foreground">Precio total</dt><dd className="font-semibold tabular-nums">{formatCurrency(reservation.totalAmount)}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Seña prevista</dt><dd className="font-semibold tabular-nums">{formatCurrency(reservation.depositAmount)}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Saldo abonado</dt><dd className="font-semibold tabular-nums">{formatCurrency(reservation.paidBalance)}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Saldo pendiente</dt><dd className="font-bold tabular-nums text-foreground">{formatCurrency(outstanding)}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-sm text-muted-foreground">Estado del pago:</span><StatusBadge variant={paymentState.variant}>{paymentState.label}</StatusBadge></div>
        </CardContent></Card>
      </div>

      <Card className="xl:col-span-4 xl:self-start"><CardHeader><CardTitle><h2 className="text-base">Acciones</h2></CardTitle><CardDescription>Operaciones disponibles para el estado actual.</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">
        <Button variant="outline" render={<a href={buildWhatsAppUrl(reservation.customerPhone, reservation.code)} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><MessageCircleIcon data-icon="inline-start" aria-hidden="true" />Contactar por WhatsApp</Button>

        {canPay ? <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogTrigger render={<Button variant="secondary" />}><BanknoteIcon data-icon="inline-start" aria-hidden="true" />Marcar saldo como pagado</DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Registrar pago</DialogTitle><DialogDescription>Esta actualización es local y se perderá al recargar.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4"><div className="rounded-md bg-muted p-3"><p className="text-sm text-muted-foreground">Saldo pendiente</p><p className="text-xl font-bold tabular-nums">{formatCurrency(outstanding)}</p></div>
              <div className="flex flex-col gap-1.5"><label htmlFor="payment-method" className="text-sm font-medium">Medio de pago</label><Select items={paymentMethodItems} value={paymentMethod} onValueChange={(value) => value && setPaymentMethod(value as (typeof PAYMENT_METHODS)[number])}><SelectTrigger id="payment-method"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{paymentMethodItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
            </div>
            <DialogFooter showCloseButton><Button onClick={handlePayment}><BanknoteIcon data-icon="inline-start" aria-hidden="true" />Confirmar pago</Button></DialogFooter>
          </DialogContent>
        </Dialog> : null}

        {canComplete ? <AlertDialog><AlertDialogTrigger render={<Button variant="outline" />}><CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />Marcar como finalizada</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Finalizar esta reserva?</AlertDialogTitle><AlertDialogDescription>La reserva pasará a estado Finalizada. El cambio es solamente local para esta demostración.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleComplete}>Marcar finalizada</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> : null}

        {!canPay && !canComplete ? <p className="text-sm text-pretty text-muted-foreground">No hay operaciones pendientes para esta reserva.</p> : null}
      </CardContent></Card>
    </div>
  </div>
}

export { ReservationDetail }

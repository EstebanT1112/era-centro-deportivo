"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserRoundPlusIcon } from "lucide-react"

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { calculateDeposit } from "@/config/reservations"
import { courts } from "@/mocks"
import { getMockCourtAvailability } from "@/mocks/court-availability"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { useAdminReservations } from "./reservations-provider"

interface NewReservationInitialValues { courtId: string; date: string; time: string }

const activeCourts = courts.filter((court) => court.status === "active")
const courtItems = activeCourts.map((court) => ({ label: court.name, value: court.id }))

function NewReservationForm({ initialValues }: { initialValues: NewReservationInitialValues }) {
  const router = useRouter()
  const { addReservation } = useAdminReservations()
  const [courtId, setCourtId] = useState(initialValues.courtId)
  const [date, setDate] = useState(initialValues.date)
  const [time, setTime] = useState(initialValues.time)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const court = activeCourts.find((item) => item.id === courtId) ?? activeCourts[0]
  const slots = useMemo(() => getMockCourtAvailability(court, [date])[date] ?? [], [court, date])
  const availableSlots = slots.filter((slot) => slot.status === "available")
  const slotItems = availableSlots.map((slot) => ({ label: `${slot.startTime}–${slot.endTime} h`, value: slot.startTime }))
  const selectedSlot = availableSlots.find((slot) => slot.startTime === time)

  function updateCourt(value: string) {
    const nextCourt = activeCourts.find((item) => item.id === value) ?? activeCourts[0]
    const nextSlots = getMockCourtAvailability(nextCourt, [date])[date]?.filter((slot) => slot.status === "available") ?? []
    setCourtId(nextCourt.id)
    setTime(nextSlots[0]?.startTime ?? "")
  }

  function updateDate(value: string) {
    const nextSlots = getMockCourtAvailability(court, [value])[value]?.filter((slot) => slot.status === "available") ?? []
    setDate(value)
    setTime(nextSlots[0]?.startTime ?? "")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!customerName.trim()) nextErrors.customerName = "Ingresá el nombre del cliente."
    if (!customerPhone.trim()) nextErrors.customerPhone = "Ingresá un teléfono de contacto."
    if (!date) nextErrors.date = "Elegí una fecha."
    if (!selectedSlot) nextErrors.time = "Elegí un horario disponible."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const reservation = addReservation({
      courtId: court.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      date,
      startTime: selectedSlot!.startTime,
      endTime: selectedSlot!.endTime,
      totalAmount: court.pricePerSlot,
    })
    toast.add({ title: "Reserva manual creada", description: `${reservation.code} · ${court.name}`, type: "success" })
    router.push(`/admin/reservas/${reservation.id}`)
  }

  return <form onSubmit={handleSubmit} noValidate className="grid gap-4 xl:grid-cols-12">
    <div className="flex flex-col gap-4 xl:col-span-8">
      {Object.keys(errors).length ? <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">Revisá los campos indicados antes de crear la reserva.</div> : null}
      <FormSection title="Turno" description="Elegí una cancha activa, fecha y horario disponible.">
        <FieldGroup><FormGrid>
          <Field><FieldLabel htmlFor="manual-court">Cancha</FieldLabel><Select items={courtItems} value={court.id} onValueChange={(value) => value && updateCourt(value)}><SelectTrigger id="manual-court"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{courtItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><FieldDescription>El precio se toma de la configuración de la cancha.</FieldDescription></Field>
          <Field data-invalid={!!errors.date}><FieldLabel htmlFor="manual-date">Fecha</FieldLabel><Input id="manual-date" type="date" required value={date} onChange={(event) => updateDate(event.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? "manual-date-error" : undefined} />{errors.date ? <FieldError id="manual-date-error">{errors.date}</FieldError> : null}</Field>
          <Field data-invalid={!!errors.time}><FieldLabel htmlFor="manual-time">Horario</FieldLabel><Select items={slotItems} value={selectedSlot?.startTime ?? null} onValueChange={(value) => value && setTime(value)}><SelectTrigger id="manual-time" aria-invalid={!!errors.time}><SelectValue>{selectedSlot ? `${selectedSlot.startTime}–${selectedSlot.endTime} h` : "Sin horarios disponibles"}</SelectValue></SelectTrigger><SelectContent><SelectGroup>{slotItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>{errors.time ? <FieldError>{errors.time}</FieldError> : null}</Field>
        </FormGrid></FieldGroup>
      </FormSection>

      <FormSection title="Cliente" description="Datos mínimos para identificar y contactar la reserva.">
        <FieldGroup><FormGrid>
          <Field data-invalid={!!errors.customerName}><FieldLabel htmlFor="manual-name">Nombre completo</FieldLabel><Input id="manual-name" autoComplete="name" required value={customerName} onChange={(event) => setCustomerName(event.target.value)} aria-invalid={!!errors.customerName} aria-describedby={errors.customerName ? "manual-name-error" : undefined} />{errors.customerName ? <FieldError id="manual-name-error">{errors.customerName}</FieldError> : null}</Field>
          <Field data-invalid={!!errors.customerPhone}><FieldLabel htmlFor="manual-phone">Teléfono</FieldLabel><Input id="manual-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+54 9 11 5555-0000" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} aria-invalid={!!errors.customerPhone} aria-describedby={errors.customerPhone ? "manual-phone-error" : undefined} />{errors.customerPhone ? <FieldError id="manual-phone-error">{errors.customerPhone}</FieldError> : null}</Field>
          <Field className="md:col-span-2"><FieldLabel htmlFor="manual-notes">Observaciones</FieldLabel><Textarea id="manual-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Indicaciones internas para esta reserva" /><FieldDescription>Campo temporal: no se persiste en el modelo mock.</FieldDescription></Field>
        </FormGrid></FieldGroup>
      </FormSection>

      <FormActions><Button variant="outline" render={<Link href="/admin/reservas" />} nativeButton={false}>Cancelar</Button><Button type="submit"><UserRoundPlusIcon data-icon="inline-start" aria-hidden="true" />Crear reserva</Button></FormActions>
    </div>

    <FormSection title="Resumen" description="La reserva se crea con pago pendiente." className="xl:col-span-4 xl:self-start">
      <dl className="flex flex-col gap-4 text-sm">
        <div><dt className="text-muted-foreground">Cancha</dt><dd className="font-semibold">{court.name}</dd></div>
        <div><dt className="text-muted-foreground">Fecha y horario</dt><dd className="font-semibold tabular-nums">{formatDate(date)} · {selectedSlot ? `${selectedSlot.startTime}–${selectedSlot.endTime} h` : "Elegí un horario"}</dd></div>
        <div><dt className="text-muted-foreground">Precio total</dt><dd className="text-lg font-bold tabular-nums">{formatCurrency(court.pricePerSlot)}</dd></div>
        <div><dt className="text-muted-foreground">Seña prevista</dt><dd className="font-semibold tabular-nums">{formatCurrency(calculateDeposit(court.pricePerSlot))}</dd></div>
      </dl>
      <p className="mt-4 text-sm text-pretty text-muted-foreground">No se registra un pago en este paso. La reserva queda en estado Pago pendiente.</p>
    </FormSection>
  </form>
}

export { NewReservationForm }
export type { NewReservationInitialValues }

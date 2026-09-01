"use client"

import { useState, type FormEvent } from "react"
import { PlusIcon, Repeat2Icon } from "lucide-react"

import { AdminTableShell } from "@/components/admin/admin-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { StatusBadge } from "@/components/shared/status-badge"
import { courts } from "@/mocks"
import { ADMIN_SCHEDULE_START_TIMES, validateRecurringReservation, WEEKDAYS } from "@/lib/admin-reservations"
import { formatDate } from "@/lib/formatters"
import { useAdminReservations } from "./reservations-provider"
import type { RecurringReservation, Weekday } from "@/types"

const activeCourts = courts.filter((court) => court.status === "active")
const courtItems = activeCourts.map((court) => ({ label: court.name, value: court.id }))
const weekdayItems = WEEKDAYS.map((label, value) => ({ label, value: String(value) }))
const timeItems = ADMIN_SCHEDULE_START_TIMES.map((time) => ({ label: `${time} h`, value: time }))

const initialDraft: Omit<RecurringReservation, "id" | "status"> = {
  customerName: "",
  customerPhone: "",
  courtId: activeCourts[0]?.id ?? "",
  weekday: 1,
  startTime: "19:00",
  startDate: "2026-08-24",
  endDate: "2026-12-21",
}

function RecurringStatus({ status }: Pick<RecurringReservation, "status">) {
  return <StatusBadge variant={status === "active" ? "success" : "neutral"}>{status === "active" ? "Activa" : "Inactiva"}</StatusBadge>
}

function MobileRecurringList({ items, onToggle }: { items: RecurringReservation[]; onToggle: (id: string) => void }) {
  return <ul className="divide-y divide-border" aria-label="Series recurrentes">{items.map((item) => <li key={item.id} className="flex flex-col gap-3 p-4">
    <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.customerName}</p><p className="text-sm text-muted-foreground">{item.customerPhone}</p></div><RecurringStatus status={item.status} /></div>
    <dl className="grid grid-cols-2 gap-2 text-sm"><div><dt className="text-muted-foreground">Turno</dt><dd className="font-medium">{WEEKDAYS[item.weekday]} · {item.startTime} h</dd></div><div><dt className="text-muted-foreground">Cancha</dt><dd className="font-medium">{courts.find((court) => court.id === item.courtId)?.name}</dd></div><div className="col-span-2"><dt className="text-muted-foreground">Vigencia</dt><dd>{formatDate(item.startDate)} – {formatDate(item.endDate)}</dd></div></dl>
    <Button variant="outline" size="sm" onClick={() => onToggle(item.id)}>{item.status === "active" ? "Desactivar serie" : "Activar serie"}</Button>
  </li>)}</ul>
}

function RecurringReservations() {
  const { recurringReservations, addRecurringReservation, toggleRecurringStatus } = useAdminReservations()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(initialDraft)
  const [error, setError] = useState("")
  const setValue = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const submittedDraft = {
      ...draft,
      customerName: String(formData.get("customerName") ?? draft.customerName),
      customerPhone: String(formData.get("customerPhone") ?? draft.customerPhone),
      startDate: String(formData.get("startDate") ?? draft.startDate),
      endDate: String(formData.get("endDate") ?? draft.endDate),
    }
    const validation = validateRecurringReservation(submittedDraft)
    if (validation) { setError(validation); return }
    addRecurringReservation(submittedDraft)
    setDraft(initialDraft)
    setError("")
    setOpen(false)
    toast.add({ title: "Reserva recurrente creada", description: "La serie se agregó al estado local del prototipo.", type: "success" })
  }

  return <div className="flex flex-col gap-4">
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setError("") }}>
        <DialogTrigger render={<Button />}><PlusIcon data-icon="inline-start" aria-hidden="true" />Nueva reserva recurrente</DialogTrigger>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Nueva reserva recurrente</DialogTitle><DialogDescription>Creá una serie semanal simulada. No se generan reservas futuras automáticamente.</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error ? <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p> : null}
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field><FieldLabel htmlFor="recurring-name">Cliente</FieldLabel><Input id="recurring-name" name="customerName" required autoComplete="name" value={draft.customerName} onChange={(event) => setValue("customerName", event.target.value)} /></Field>
              <Field><FieldLabel htmlFor="recurring-phone">Teléfono</FieldLabel><Input id="recurring-phone" name="customerPhone" required type="tel" autoComplete="tel" value={draft.customerPhone} onChange={(event) => setValue("customerPhone", event.target.value)} /></Field>
              <Field><FieldLabel htmlFor="recurring-court">Cancha</FieldLabel><Select items={courtItems} value={draft.courtId} onValueChange={(value) => value && setValue("courtId", value)}><SelectTrigger id="recurring-court"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{courtItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
              <Field><FieldLabel htmlFor="recurring-weekday">Día de la semana</FieldLabel><Select items={weekdayItems} value={String(draft.weekday)} onValueChange={(value) => value && setValue("weekday", Number(value) as Weekday)}><SelectTrigger id="recurring-weekday"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{weekdayItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
              <Field><FieldLabel htmlFor="recurring-time">Horario</FieldLabel><Select items={timeItems} value={draft.startTime} onValueChange={(value) => value && setValue("startTime", value)}><SelectTrigger id="recurring-time"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{timeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
              <div className="hidden sm:block" aria-hidden="true" />
              <Field><FieldLabel htmlFor="recurring-start">Fecha desde</FieldLabel><Input id="recurring-start" name="startDate" required type="date" value={draft.startDate} onChange={(event) => setValue("startDate", event.target.value)} /></Field>
              <Field><FieldLabel htmlFor="recurring-end">Fecha hasta</FieldLabel><Input id="recurring-end" name="endDate" required type="date" value={draft.endDate} onChange={(event) => setValue("endDate", event.target.value)} /></Field>
            </FieldGroup>
            <DialogFooter showCloseButton><Button type="submit"><Repeat2Icon data-icon="inline-start" aria-hidden="true" />Crear serie</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <AdminTableShell title="Series recurrentes" description={`${recurringReservations.length} series configuradas.`} mobileFallback={<MobileRecurringList items={recurringReservations} onToggle={toggleRecurringStatus} />}>
      <Table><TableCaption className="sr-only">Reservas recurrentes con cliente, cancha, día, horario, vigencia y estado.</TableCaption><TableHeader><TableRow><TableHead scope="col">Cliente</TableHead><TableHead scope="col">Cancha</TableHead><TableHead scope="col">Día</TableHead><TableHead scope="col">Horario</TableHead><TableHead scope="col">Desde</TableHead><TableHead scope="col">Hasta</TableHead><TableHead scope="col">Estado</TableHead><TableHead scope="col">Acciones</TableHead></TableRow></TableHeader>
        <TableBody>{recurringReservations.map((item) => <TableRow key={item.id}><TableCell><p className="font-medium">{item.customerName}</p><p className="text-xs text-muted-foreground">{item.customerPhone}</p></TableCell><TableCell>{courts.find((court) => court.id === item.courtId)?.name}</TableCell><TableCell>{WEEKDAYS[item.weekday]}</TableCell><TableCell className="tabular-nums">{item.startTime} h</TableCell><TableCell>{formatDate(item.startDate)}</TableCell><TableCell>{formatDate(item.endDate)}</TableCell><TableCell><RecurringStatus status={item.status} /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => toggleRecurringStatus(item.id)}>{item.status === "active" ? "Desactivar" : "Activar"}</Button></TableCell></TableRow>)}</TableBody>
      </Table>
    </AdminTableShell>
  </div>
}

export { RecurringReservations }

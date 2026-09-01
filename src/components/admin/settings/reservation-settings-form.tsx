"use client"

import { useState } from "react"
import { SaveIcon } from "lucide-react"

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SettingsNav } from "@/components/admin/settings/settings-nav"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { reservationSettings as initialSettings } from "@/config/reservations"
import type { ReservationSettings } from "@/types"

const durationItems = [60, 90, 120].map((value) => ({ value: String(value), label: `${value} min` }))

function NumberSetting({ id, label, unit, description, value, error, min, max, onChange }: { id: string; label: string; unit: string; description: string; value: number; error?: string; min: number; max?: number; onChange: (value: number) => void }) {
  const descriptionId = `${id}-description`; const errorId = `${id}-error`
  return <Field data-invalid={!!error}><FieldLabel htmlFor={id}>{label}</FieldLabel><div className="relative"><Input id={id} type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="pr-20" aria-invalid={!!error} aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`} /><span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">{unit}</span></div><FieldDescription id={descriptionId}>{description}</FieldDescription>{error ? <FieldError id={errorId}>{error}</FieldError> : null}</Field>
}

function ReservationSettingsForm() {
  const [settings, setSettings] = useState<ReservationSettings>({ ...initialSettings })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const setValue = <K extends keyof ReservationSettings>(key: K, value: ReservationSettings[K]) => setSettings((current) => ({ ...current, [key]: value }))
  const save = () => {
    const next: Record<string, string> = {}
    if (settings.depositPercentage < 0 || settings.depositPercentage > 100) next.depositPercentage = "Usá un valor entre 0 y 100."
    if (!(settings.holdMinutes > 0)) next.holdMinutes = "Debe ser mayor que cero."
    if (!(settings.defaultSlotMinutes > 0)) next.defaultSlotMinutes = "Elegí una duración válida."
    if (settings.minAdvanceHours < 0) next.minAdvanceHours = "No puede ser negativa."
    if (!(settings.maxAdvanceDays > 0)) next.maxAdvanceDays = "Debe ser mayor que cero."
    setErrors(next)
    if (Object.keys(next).length) return
    toast.add({ title: "Configuración de reservas actualizada", description: "El cambio se mantiene durante esta sesión.", type: "success" })
  }
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Configuración de reservas" description="Definí los valores generales usados como referencia por el flujo de turnos." breadcrumbs={[{ label: "Configuración" }, { label: "Reservas" }]} /><SettingsNav /><div className="max-w-4xl"><FormSection title="Condiciones generales" description="Estos valores son iniciales del prototipo y no sobrescriben canchas existentes."><FieldGroup><FormGrid><NumberSetting id="deposit-percentage" label="Porcentaje de seña" unit="%" description="Porción del turno que se simula pagar al confirmar." value={settings.depositPercentage} min={0} max={100} error={errors.depositPercentage} onChange={(value) => setValue("depositPercentage", value)} /><NumberSetting id="hold-minutes" label="Tiempo de retención" unit="minutos" description="Tiempo visual disponible mientras se completa el pago." value={settings.holdMinutes} min={1} error={errors.holdMinutes} onChange={(value) => setValue("holdMinutes", value)} /><Field data-invalid={!!errors.defaultSlotMinutes}><FieldLabel htmlFor="default-slot">Duración estándar del turno</FieldLabel><Select items={durationItems} value={String(settings.defaultSlotMinutes)} onValueChange={(value) => value && setValue("defaultSlotMinutes", Number(value))}><SelectTrigger id="default-slot" aria-invalid={!!errors.defaultSlotMinutes} aria-describedby="default-slot-description"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{durationItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><FieldDescription id="default-slot-description">Valor sugerido para nuevas canchas; cada cancha conserva su propia duración.</FieldDescription>{errors.defaultSlotMinutes ? <FieldError>{errors.defaultSlotMinutes}</FieldError> : null}</Field><NumberSetting id="min-advance" label="Anticipación mínima" unit="horas" description="Tiempo mínimo requerido antes del inicio del turno." value={settings.minAdvanceHours} min={0} error={errors.minAdvanceHours} onChange={(value) => setValue("minAdvanceHours", value)} /><NumberSetting id="max-advance" label="Anticipación máxima" unit="días" description="Cantidad máxima de días disponibles hacia el futuro." value={settings.maxAdvanceDays} min={1} error={errors.maxAdvanceDays} onChange={(value) => setValue("maxAdvanceDays", value)} /></FormGrid><FormActions><Button onClick={save}><SaveIcon data-icon="inline-start" aria-hidden="true" />Guardar configuración</Button></FormActions></FieldGroup></FormSection></div></div>
}

export { ReservationSettingsForm }

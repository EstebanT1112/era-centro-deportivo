"use client"

import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WEEKDAYS } from "@/constants/domain"
import { createEmptySchedule, type DisciplineFormErrors } from "@/lib/admin-disciplines"
import type { DisciplineSchedule, Weekday } from "@/types"

interface DisciplineScheduleEditorProps {
  categoryIndex: number
  schedules: DisciplineSchedule[]
  errors: DisciplineFormErrors
  nextId: () => string
  onChange: (schedules: DisciplineSchedule[]) => void
}

function DisciplineScheduleEditor({ categoryIndex, schedules, errors, nextId, onChange }: DisciplineScheduleEditorProps) {
  function updateSchedule(index: number, patch: Partial<DisciplineSchedule>) {
    onChange(schedules.map((schedule, itemIndex) => itemIndex === index ? { ...schedule, ...patch } : schedule))
  }

  return (
    <section aria-labelledby={`category-${categoryIndex}-schedules-heading`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h4 id={`category-${categoryIndex}-schedules-heading`} className="font-heading text-sm font-semibold">Horarios</h4><FieldDescription>Los horarios podrán indicarse o ajustarse más adelante.</FieldDescription></div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...schedules, createEmptySchedule(nextId())])}><PlusIcon data-icon="inline-start" aria-hidden="true" />Agregar horario</Button>
      </div>
      {schedules.length ? <ol className="flex flex-col gap-3" aria-label="Horarios de la categoría">{schedules.map((schedule, scheduleIndex) => {
        const path = `categories.${categoryIndex}.schedules.${scheduleIndex}`
        const rowError = errors[`${path}.weekday`] || errors[`${path}.startTime`] || errors[`${path}.endTime`] || errors[`${path}.duplicate`]
        return <li key={schedule.id} className="grid gap-3 rounded-md border border-border bg-background-subtle p-3 sm:grid-cols-2 lg:grid-cols-[minmax(9rem,1fr)_minmax(8rem,1fr)_minmax(8rem,1fr)_auto] lg:items-end">
          <Field data-invalid={!!errors[`${path}.weekday`]}><FieldLabel htmlFor={`${schedule.id}-weekday`}>Día</FieldLabel><Select items={WEEKDAYS} value={schedule.weekday} onValueChange={(value) => value !== null && updateSchedule(scheduleIndex, { weekday: Number(value) as Weekday })}><SelectTrigger id={`${schedule.id}-weekday`} aria-invalid={!!errors[`${path}.weekday`]} aria-describedby={rowError ? `${schedule.id}-error` : undefined}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{WEEKDAYS.map((day) => <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
          <Field data-invalid={!!errors[`${path}.startTime`]}><FieldLabel htmlFor={`${schedule.id}-start`}>Desde</FieldLabel><Input id={`${schedule.id}-start`} type="time" value={schedule.startTime} onChange={(event) => updateSchedule(scheduleIndex, { startTime: event.target.value })} aria-invalid={!!errors[`${path}.startTime`]} aria-describedby={rowError ? `${schedule.id}-error` : undefined} /></Field>
          <Field data-invalid={!!errors[`${path}.endTime`]}><FieldLabel htmlFor={`${schedule.id}-end`}>Hasta</FieldLabel><Input id={`${schedule.id}-end`} type="time" value={schedule.endTime} onChange={(event) => updateSchedule(scheduleIndex, { endTime: event.target.value })} aria-invalid={!!errors[`${path}.endTime`] || !!errors[`${path}.duplicate`]} aria-describedby={rowError ? `${schedule.id}-error` : undefined} /></Field>
          <Button type="button" variant="ghost" size="icon" aria-label={`Eliminar horario ${scheduleIndex + 1}`} onClick={() => onChange(schedules.filter((_, itemIndex) => itemIndex !== scheduleIndex))}><Trash2Icon aria-hidden="true" /></Button>
          {rowError ? <FieldError id={`${schedule.id}-error`} className="sm:col-span-2 lg:col-span-4">{rowError}</FieldError> : null}
        </li>
      })}</ol> : <p className="rounded-md border border-dashed border-border-strong bg-muted/40 px-4 py-5 text-center text-sm text-muted-foreground">Esta categoría todavía no tiene horarios.</p>}
    </section>
  )
}

export { DisciplineScheduleEditor }

"use client"

import { UserRoundIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import type { Teacher } from "@/types"

interface TeacherSelectorProps {
  idPrefix: string
  legend: string
  description?: string
  teachers: readonly Teacher[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

function TeacherSelector({ idPrefix, legend, description, teachers, selectedIds, onChange, error }: TeacherSelectorProps) {
  const availableTeachers = teachers.filter((teacher) => teacher.isActive || selectedIds.includes(teacher.id))

  function toggleTeacher(teacherId: string, checked: boolean) {
    onChange(checked ? [...new Set([...selectedIds, teacherId])] : selectedIds.filter((id) => id !== teacherId))
  }

  return (
    <FieldSet aria-invalid={!!error} aria-describedby={error ? `${idPrefix}-error` : description ? `${idPrefix}-help` : undefined}>
      <FieldLegend variant="label">{legend}</FieldLegend>
      {description ? <FieldDescription id={`${idPrefix}-help`}>{description}</FieldDescription> : null}
      {availableTeachers.length ? (
        <FieldGroup data-slot="checkbox-group" className="grid gap-2 sm:grid-cols-2">
          {availableTeachers.map((teacher) => {
            const id = `${idPrefix}-${teacher.id}`
            return (
              <Field key={teacher.id} orientation="horizontal" className="min-h-12 rounded-md border border-border bg-surface px-3 py-2.5">
                <Checkbox id={id} checked={selectedIds.includes(teacher.id)} onCheckedChange={(checked) => toggleTeacher(teacher.id, checked)} />
                <div className="min-w-0 flex-1">
                  <FieldLabel htmlFor={id}>{teacher.name}</FieldLabel>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StatusBadge variant={teacher.isActive ? "success" : "warning"}>{teacher.isActive ? "Activo" : "Inactivo"}</StatusBadge>
                    {teacher.email ? <span className="truncate text-xs text-muted-foreground">{teacher.email}</span> : null}
                  </div>
                </div>
              </Field>
            )
          })}
        </FieldGroup>
      ) : (
        <EmptyState icon={UserRoundIcon} title="No hay profesores activos disponibles" description="Podrás asociarlos cuando exista al menos un profesor activo." titleAs="h3" className="py-6" />
      )}
      {error ? <p id={`${idPrefix}-error`} role="alert" className="text-sm text-destructive">{error}</p> : null}
    </FieldSet>
  )
}

export { TeacherSelector }

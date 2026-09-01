"use client"

import { useState } from "react"
import { AlertCircleIcon, ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createEmptyCategory, type DisciplineFormErrors } from "@/lib/admin-disciplines"
import type { DisciplineCategory, Teacher } from "@/types"

import { DisciplineScheduleEditor } from "./discipline-schedule-editor"
import { TeacherSelector } from "./teacher-selector"

interface DisciplineCategoryEditorProps {
  categories: DisciplineCategory[]
  teachers: readonly Teacher[]
  errors: DisciplineFormErrors
  nextId: (prefix: string) => string
  onChange: (categories: DisciplineCategory[]) => void
}

function DisciplineCategoryEditor({ categories, teachers, errors, nextId, onChange }: DisciplineCategoryEditorProps) {
  const [openIds, setOpenIds] = useState<string[]>(() => categories[0] ? [categories[0].id] : [])

  function updateCategory(index: number, patch: Partial<DisciplineCategory>) {
    onChange(categories.map((category, itemIndex) => itemIndex === index ? { ...category, ...patch } : category))
  }

  function addCategory() {
    const category = createEmptyCategory(nextId("category"), categories.length + 1)
    onChange([...categories, category])
    setOpenIds((current) => [...current, category.id])
    window.setTimeout(() => document.getElementById(`${category.id}-name`)?.focus(), 0)
  }

  function removeCategory(index: number) {
    const removed = categories[index]
    onChange(categories.filter((_, itemIndex) => itemIndex !== index).map((category, itemIndex) => ({ ...category, order: itemIndex + 1 })))
    setOpenIds((current) => current.filter((id) => id !== removed.id))
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= categories.length) return
    const next = [...categories]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next.map((category, itemIndex) => ({ ...category, order: itemIndex + 1 })))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-pretty text-muted-foreground">Cada categoría conserva sus propios horarios, lugar y profesores. Los cambios no alteran los responsables generales.</p>
        <Button type="button" variant="outline" size="sm" onClick={addCategory}><PlusIcon data-icon="inline-start" aria-hidden="true" />Agregar categoría</Button>
      </div>

      {categories.length ? (
        <Accordion multiple value={openIds} onValueChange={setOpenIds} className="flex flex-col gap-3">
          {categories.map((category, categoryIndex) => {
            const path = `categories.${categoryIndex}`
            const categoryErrors = Object.keys(errors).filter((key) => key.startsWith(`${path}.`))
            return (
              <AccordionItem key={category.id} value={category.id} className="overflow-hidden rounded-lg border border-border bg-background-subtle">
                <AccordionTrigger className="gap-3 rounded-none px-4 py-3 hover:no-underline">
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-heading font-semibold">{category.name || `Categoría ${categoryIndex + 1}`}</span>
                      <StatusBadge variant={category.isActive ? "success" : "neutral"}>{category.isActive ? "Activa" : "Inactiva"}</StatusBadge>
                      {categoryErrors.length ? <StatusBadge variant="danger" icon={AlertCircleIcon}>{categoryErrors.length} {categoryErrors.length === 1 ? "error" : "errores"}</StatusBadge> : null}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">{category.ageRange || "Sin rango de edad"} · {category.schedules.length} {category.schedules.length === 1 ? "horario" : "horarios"} · {category.teacherIds.length} {category.teacherIds.length === 1 ? "profesor" : "profesores"}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-6 border-t border-border px-4 py-4 sm:px-5">
                  <fieldset className="flex flex-col gap-5">
                    <legend className="sr-only">Datos de {category.name || `categoría ${categoryIndex + 1}`}</legend>
                    <FieldGroup>
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field data-invalid={!!errors[`${path}.name`]}><FieldLabel htmlFor={`${category.id}-name`}>Nombre</FieldLabel><Input id={`${category.id}-name`} required value={category.name} onChange={(event) => updateCategory(categoryIndex, { name: event.target.value })} aria-invalid={!!errors[`${path}.name`]} aria-describedby={errors[`${path}.name`] ? `${category.id}-name-error` : undefined} placeholder="Ej. Sub-15" />{errors[`${path}.name`] ? <FieldError id={`${category.id}-name-error`}>{errors[`${path}.name`]}</FieldError> : null}</Field>
                        <Field><FieldLabel htmlFor={`${category.id}-age`}>Rango de edad</FieldLabel><Input id={`${category.id}-age`} value={category.ageRange ?? ""} onChange={(event) => updateCategory(categoryIndex, { ageRange: event.target.value })} placeholder="Ej. 13 a 15 años" /></Field>
                        <Field className="md:col-span-2"><FieldLabel htmlFor={`${category.id}-description`}>Descripción</FieldLabel><Textarea id={`${category.id}-description`} rows={3} value={category.description ?? ""} onChange={(event) => updateCategory(categoryIndex, { description: event.target.value })} placeholder="Información específica de esta categoría." /></Field>
                        <Field><FieldLabel htmlFor={`${category.id}-location`}>Lugar</FieldLabel><Input id={`${category.id}-location`} value={category.location ?? ""} onChange={(event) => updateCategory(categoryIndex, { location: event.target.value })} placeholder="Usar lugar general" /><FieldDescription>Si queda vacío, se usa el lugar general de la disciplina.</FieldDescription></Field>
                        <Field data-invalid={!!errors[`${path}.order`]}><FieldLabel htmlFor={`${category.id}-order`}>Orden</FieldLabel><Input id={`${category.id}-order`} type="number" value={category.order} readOnly aria-invalid={!!errors[`${path}.order`]} /><FieldDescription>Usá los controles de la categoría para cambiar su posición.</FieldDescription>{errors[`${path}.order`] ? <FieldError>{errors[`${path}.order`]}</FieldError> : null}</Field>
                        <Field orientation="horizontal" className="md:col-span-2 rounded-md border border-border bg-surface p-3"><Switch id={`${category.id}-active`} checked={category.isActive} onCheckedChange={(checked) => updateCategory(categoryIndex, { isActive: checked })} /><FieldContent><FieldLabel htmlFor={`${category.id}-active`}>Categoría activa</FieldLabel><FieldDescription>Las categorías inactivas no se muestran públicamente.</FieldDescription></FieldContent></Field>
                      </div>
                    </FieldGroup>
                  </fieldset>

                  <DisciplineScheduleEditor categoryIndex={categoryIndex} schedules={category.schedules} errors={errors} nextId={() => nextId("schedule")} onChange={(schedules) => updateCategory(categoryIndex, { schedules })} />
                  <TeacherSelector idPrefix={`${category.id}-teachers`} legend="Profesores de la categoría" description="Seleccioná uno o varios profesores existentes. Las asociaciones son independientes de los responsables generales." teachers={teachers} selectedIds={category.teacherIds} onChange={(teacherIds) => updateCategory(categoryIndex, { teacherIds })} error={errors[`${path}.teacherIds`]} />

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover ${category.name || `categoría ${categoryIndex + 1}`} hacia arriba`} disabled={categoryIndex === 0} onClick={() => moveCategory(categoryIndex, -1)}><ArrowUpIcon aria-hidden="true" /></Button>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover ${category.name || `categoría ${categoryIndex + 1}`} hacia abajo`} disabled={categoryIndex === categories.length - 1} onClick={() => moveCategory(categoryIndex, 1)}><ArrowDownIcon aria-hidden="true" /></Button>
                    </div>
                    {category.schedules.length || category.teacherIds.length ? <AdminConfirmDialog trigger={<Button type="button" variant="ghost" size="sm"><Trash2Icon data-icon="inline-start" aria-hidden="true" />Eliminar categoría</Button>} title={`Eliminar ${category.name || "esta categoría"}`} description="También se quitarán sus horarios y asociaciones con profesores. Este cambio solo afecta el estado local del prototipo." confirmLabel="Eliminar categoría" onConfirm={() => removeCategory(categoryIndex)} /> : <Button type="button" variant="ghost" size="sm" onClick={() => removeCategory(categoryIndex)}><Trash2Icon data-icon="inline-start" aria-hidden="true" />Eliminar categoría</Button>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      ) : (
        <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-8 text-center"><p className="font-medium">Todavía no hay categorías</p><p className="mt-1 text-sm text-pretty text-muted-foreground">Podés guardar la disciplina sin categorías o agregar la primera ahora.</p></div>
      )}
    </div>
  )
}

export { DisciplineCategoryEditor }

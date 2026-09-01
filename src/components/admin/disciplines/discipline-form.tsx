"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, type FormEvent } from "react"
import { DumbbellIcon, ExternalLinkIcon, SaveIcon } from "lucide-react"

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  cloneDiscipline,
  createEmptyDiscipline,
  normalizeDisciplineDraft,
  slugifyDisciplineName,
  validateDiscipline,
  type DisciplineDraft,
} from "@/lib/admin-disciplines"
import { useAdminTeachers } from "@/components/admin/teachers/teachers-provider"

import { DisciplineCategoryEditor } from "./discipline-category-editor"
import { DisciplineImageManager } from "./discipline-image-manager"
import { useAdminDisciplines } from "./disciplines-provider"
import { TeacherSelector } from "./teacher-selector"

function DisciplineForm({ disciplineId }: { disciplineId: string }) {
  const router = useRouter()
  const { disciplines, addDiscipline, updateDiscipline } = useAdminDisciplines()
  const { teachers } = useAdminTeachers()
  const isNew = disciplineId === "nueva"
  const existingDiscipline = disciplines.find((discipline) => discipline.id === disciplineId)
  const [draft, setDraft] = useState<DisciplineDraft>(() => isNew || !existingDiscipline ? createEmptyDiscipline(disciplines.length + 1) : cloneDiscipline(existingDiscipline))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const localId = useRef(1)

  const setValue = <K extends keyof DisciplineDraft>(key: K, value: DisciplineDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const nextId = (prefix: string) => `${prefix}-draft-${localId.current++}`

  if (!isNew && !existingDiscipline) {
    return (
      <div className="flex flex-col gap-5">
        <AdminPageHeader title="Disciplina no disponible" description="Esta disciplina pertenecía al estado temporal de una sesión anterior." breadcrumbs={[{ label: "Disciplinas", href: "/admin/disciplinas" }, { label: "No disponible" }]} />
        <EmptyState icon={DumbbellIcon} title="La disciplina ya no está en esta sesión" description="Los cambios mock se reinician al recargar. Volvé al listado para continuar con las disciplinas disponibles." titleAs="h2" action={<Button render={<Link href="/admin/disciplinas" />} nativeButton={false}>Volver a Disciplinas</Button>} />
      </div>
    )
  }

  function handleNameChange(name: string) {
    setDraft((current) => ({ ...current, name, slug: slugifyDisciplineName(name) }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = normalizeDisciplineDraft(draft)
    const nextErrors = validateDiscipline(normalized, disciplines, isNew ? undefined : disciplineId, teachers)
    setDraft(normalized)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => document.getElementById("discipline-form-errors")?.focus(), 0)
      return
    }

    setSaving(true)
    const saved = isNew ? addDiscipline(normalized) : updateDiscipline(disciplineId, normalized)
    setSaving(false)
    if (!saved) return

    toast.add({
      title: isNew ? "Disciplina creada correctamente" : "Disciplina actualizada correctamente",
      description: `${saved.name} · cambios guardados en el estado local de esta sesión.`,
      type: "success",
    })
    if (isNew) router.replace("/admin/disciplinas")
  }

  const errorCount = Object.keys(errors).length

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title={isNew ? "Nueva disciplina" : "Editar disciplina"}
        description={isNew ? "Configurá la actividad y mantenela oculta hasta que esté lista para publicarse." : existingDiscipline!.name}
        breadcrumbs={[{ label: "Disciplinas", href: "/admin/disciplinas" }, { label: isNew ? "Nueva disciplina" : existingDiscipline!.name }]}
        actions={<>{!isNew && existingDiscipline!.isVisible ? <Button variant="outline" render={<Link href={`/disciplinas/${existingDiscipline!.slug}`} />} nativeButton={false}><ExternalLinkIcon data-icon="inline-start" aria-hidden="true" />Ver en sitio</Button> : !isNew ? <StatusBadge variant="neutral">No visible públicamente</StatusBadge> : null}<Button type="submit" form="discipline-form" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear disciplina" : "Guardar cambios"}</Button></>}
      />

      <form id="discipline-form" onSubmit={handleSubmit} noValidate className="grid gap-4 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-8">
          {errorCount ? <Alert id="discipline-form-errors" variant="destructive" role="alert" tabIndex={-1}><AlertTitle>Revisá los campos indicados</AlertTitle><AlertDescription>Hay {errorCount} {errorCount === 1 ? "dato pendiente" : "datos pendientes"} antes de guardar. Las categorías con errores están señaladas en su encabezado.</AlertDescription></Alert> : null}

          <FormSection title="Información general" description="Datos principales utilizados por el catálogo y el detalle público.">
            <FieldGroup>
              <FormGrid>
                <Field data-invalid={!!errors.name}><FieldLabel htmlFor="discipline-name">Nombre</FieldLabel><Input id="discipline-name" required value={draft.name} onChange={(event) => handleNameChange(event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "discipline-name-error" : undefined} placeholder="Ej. Hockey" />{errors.name ? <FieldError id="discipline-name-error">{errors.name}</FieldError> : null}</Field>
                <Field data-invalid={!!errors.slug}><FieldLabel htmlFor="discipline-slug">Slug</FieldLabel><Input id="discipline-slug" value={draft.slug} readOnly aria-invalid={!!errors.slug} aria-describedby={errors.slug ? "discipline-slug-error" : "discipline-slug-help"} /><FieldDescription id="discipline-slug-help">Se genera desde el nombre: /disciplinas/{draft.slug || "nombre-disciplina"}</FieldDescription>{errors.slug ? <FieldError id="discipline-slug-error">{errors.slug}</FieldError> : null}</Field>
                <Field className="md:col-span-2" data-invalid={!!errors.shortDescription}><FieldLabel htmlFor="discipline-short-description">Descripción breve</FieldLabel><Textarea id="discipline-short-description" required rows={2} value={draft.shortDescription} onChange={(event) => setValue("shortDescription", event.target.value)} aria-invalid={!!errors.shortDescription} aria-describedby={errors.shortDescription ? "discipline-short-error" : "discipline-short-help"} placeholder="Resumen para cards y listados públicos." /><FieldDescription id="discipline-short-help">Usala para explicar la propuesta en una o dos frases.</FieldDescription>{errors.shortDescription ? <FieldError id="discipline-short-error">{errors.shortDescription}</FieldError> : null}</Field>
                <Field className="md:col-span-2" data-invalid={!!errors.description}><FieldLabel htmlFor="discipline-description">Descripción completa</FieldLabel><Textarea id="discipline-description" required rows={5} value={draft.description} onChange={(event) => setValue("description", event.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? "discipline-description-error" : undefined} placeholder="Describí modalidad, objetivos y experiencia de la actividad." />{errors.description ? <FieldError id="discipline-description-error">{errors.description}</FieldError> : null}</Field>
                <Field className="md:col-span-2"><FieldLabel htmlFor="discipline-location">Lugar general</FieldLabel><Input id="discipline-location" value={draft.location ?? ""} onChange={(event) => setValue("location", event.target.value)} placeholder="Ej. Gimnasio cubierto" /><FieldDescription>Se utilizará cuando una categoría no tenga un lugar específico.</FieldDescription></Field>
              </FormGrid>
            </FieldGroup>
          </FormSection>

          <FormSection title="Imágenes" description="Administrá la portada y una galería breve con recursos mock locales.">
            <DisciplineImageManager coverImage={draft.coverImage} images={draft.images} disciplineName={draft.name} error={errors.coverImage} onCoverChange={(coverImage) => setValue("coverImage", coverImage)} onImagesChange={(images) => setValue("images", images)} />
          </FormSection>

          <FormSection title="Categorías" description="Organizá grupos, edades, horarios, lugares y profesores dentro de la disciplina.">
            <DisciplineCategoryEditor categories={draft.categories} teachers={teachers} errors={errors} nextId={nextId} onChange={(categories) => setValue("categories", categories)} />
          </FormSection>
        </div>

        <aside className="flex min-w-0 flex-col gap-4 xl:col-span-4" aria-label="Configuración complementaria">
          <FormSection title="Responsables generales" description="Responsables o coordinadores de toda la disciplina.">
            <TeacherSelector idPrefix="discipline-responsible" legend="Responsables" description="Podés seleccionar ninguno, uno o varios profesores existentes." teachers={teachers} selectedIds={draft.responsibleTeacherIds} onChange={(ids) => setValue("responsibleTeacherIds", ids)} error={errors.responsibleTeacherIds} />
          </FormSection>

          <FormSection title="Requisitos" description="Información necesaria para comenzar la actividad.">
            <Field><FieldLabel htmlFor="discipline-requirements">Documentación e indumentaria</FieldLabel><Textarea id="discipline-requirements" rows={5} value={draft.requirements ?? ""} onChange={(event) => setValue("requirements", event.target.value)} placeholder="Ej. Apto físico vigente y ropa deportiva." /><FieldDescription>Si queda vacío, esta sección no aparecerá públicamente.</FieldDescription></Field>
          </FormSection>

          <FormSection title="Publicación" description="Definí dónde se muestra la disciplina y su orden.">
            <FieldGroup>
              <Field orientation="horizontal"><Switch id="discipline-visible" checked={draft.isVisible} onCheckedChange={(checked) => setValue("isVisible", checked)} /><FieldContent><FieldLabel htmlFor="discipline-visible">Visible en el sitio</FieldLabel><FieldDescription>Las disciplinas ocultas no aparecen en el catálogo público.</FieldDescription></FieldContent></Field>
              <Field orientation="horizontal"><Switch id="discipline-featured" checked={draft.isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} /><FieldContent><FieldLabel htmlFor="discipline-featured">Destacada en Inicio</FieldLabel><FieldDescription>Puede aparecer en la página principal si también está visible.</FieldDescription></FieldContent></Field>
              {draft.isFeatured && !draft.isVisible ? <Alert><AlertTitle>Destacada pero oculta</AlertTitle><AlertDescription>Una disciplina oculta no aparecerá en Inicio aunque esté marcada como destacada.</AlertDescription></Alert> : null}
              <Field data-invalid={!!errors.order}><FieldLabel htmlFor="discipline-order">Orden de aparición</FieldLabel><Input id="discipline-order" type="number" min={0} step={1} value={draft.order} onChange={(event) => setValue("order", Number(event.target.value))} aria-invalid={!!errors.order} aria-describedby={errors.order ? "discipline-order-error" : undefined} />{errors.order ? <FieldError id="discipline-order-error">{errors.order}</FieldError> : null}</Field>
            </FieldGroup>
          </FormSection>
        </aside>

        <div className="xl:col-span-12">
          <FormActions>
            <Button type="button" variant="outline" render={<Link href="/admin/disciplinas" />} nativeButton={false}>Cancelar</Button>
            <Button type="submit" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear disciplina" : "Guardar cambios"}</Button>
          </FormActions>
        </div>
      </form>
    </div>
  )
}

export { DisciplineForm }

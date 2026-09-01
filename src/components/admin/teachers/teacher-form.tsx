"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { MailIcon, MessageCircleIcon, SaveIcon, TriangleAlertIcon, UserRoundXIcon } from "lucide-react"

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
import { cloneTeacher, createEmptyTeacher, formatPhoneForDisplay, normalizeTeacherDraft, validateTeacher, type TeacherDraft } from "@/lib/admin-teachers"
import { getTeacherAssignments } from "@/lib/teachers"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

import { useAdminDisciplines } from "../disciplines/disciplines-provider"
import { TeacherAssignments } from "./teacher-assignments"
import { TeacherImageField } from "./teacher-image-field"
import { useAdminTeachers } from "./teachers-provider"

function TeacherForm({ teacherId }: { teacherId: string }) {
  const router = useRouter()
  const { teachers, addTeacher, updateTeacher } = useAdminTeachers()
  const { disciplines } = useAdminDisciplines()
  const isNew = teacherId === "nuevo"
  const existingTeacher = teachers.find((teacher) => teacher.id === teacherId)
  const [draft, setDraft] = useState<TeacherDraft>(() => isNew || !existingTeacher ? createEmptyTeacher() : cloneTeacher(existingTeacher))
  const [errors, setErrors] = useState<ReturnType<typeof validateTeacher>>({})
  const [saving, setSaving] = useState(false)
  const assignments = isNew ? [] : getTeacherAssignments(teacherId, disciplines)
  const setValue = <K extends keyof TeacherDraft>(key: K, value: TeacherDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))

  if (!isNew && !existingTeacher) {
    return (
      <div className="flex flex-col gap-5">
        <AdminPageHeader title="Profesor no disponible" description="Este perfil pertenecía al estado temporal de una sesión anterior." breadcrumbs={[{ label: "Profesores", href: "/admin/profesores" }, { label: "No disponible" }]} />
        <EmptyState icon={UserRoundXIcon} title="El perfil ya no está en esta sesión" description="Los cambios mock se reinician al recargar. Volvé al listado para continuar con los profesores disponibles." titleAs="h2" action={<Button render={<Link href="/admin/profesores" />} nativeButton={false}>Volver a Profesores</Button>} />
      </div>
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = normalizeTeacherDraft(draft)
    const nextErrors = validateTeacher(normalized)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => document.getElementById("teacher-form-errors")?.focus(), 0)
      return
    }

    setSaving(true)
    const saved = isNew ? addTeacher(normalized) : updateTeacher(teacherId, normalized)
    setSaving(false)
    if (!saved) return

    toast.add({
      title: isNew ? "Profesor creado correctamente" : "Profesor actualizado correctamente",
      description: `${saved.name} · cambios guardados en el estado local de esta sesión.`,
      type: "success",
    })
    if (isNew) router.replace("/admin/profesores")
  }

  const errorCount = Object.keys(errors).length
  const whatsappUrl = !isNew && draft.phone ? buildWhatsAppUrl(draft.phone, `Hola ${draft.name}, te contacto desde la administración de ERA Club.`) : undefined

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title={isNew ? "Nuevo profesor" : "Editar profesor"}
        description={isNew ? "Creá un perfil de contacto para asociarlo luego desde Disciplinas." : existingTeacher!.name}
        breadcrumbs={[{ label: "Profesores", href: "/admin/profesores" }, { label: isNew ? "Nuevo profesor" : existingTeacher!.name }]}
        actions={<>{!isNew ? <StatusBadge variant={draft.isActive ? "success" : "neutral"}>{draft.isActive ? "Activo" : "Inactivo"}</StatusBadge> : null}{whatsappUrl ? <Button variant="whatsapp" render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><MessageCircleIcon data-icon="inline-start" aria-hidden="true" />WhatsApp</Button> : null}{!isNew && draft.email ? <Button variant="outline" render={<a href={`mailto:${draft.email}`} />} nativeButton={false}><MailIcon data-icon="inline-start" aria-hidden="true" />Email</Button> : null}<Button type="submit" form="teacher-form" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear profesor" : "Guardar cambios"}</Button></>}
      />

      <form id="teacher-form" onSubmit={handleSubmit} noValidate className="grid gap-4 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-8">
          {errorCount ? <Alert id="teacher-form-errors" variant="destructive" role="alert" tabIndex={-1}><AlertTitle>Revisá los campos indicados</AlertTitle><AlertDescription>Hay {errorCount} {errorCount === 1 ? "dato pendiente" : "datos pendientes"} antes de guardar.</AlertDescription></Alert> : null}

          <FormSection title="Información personal" description="Datos que identifican al profesor dentro del club y en las disciplinas públicas.">
            <FieldGroup>
              <Field data-invalid={!!errors.name}><FieldLabel htmlFor="teacher-name">Nombre y apellido</FieldLabel><Input id="teacher-name" name="name" autoComplete="name" required value={draft.name} onChange={(event) => setValue("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "teacher-name-error" : undefined} placeholder="Ej. Valentina Suárez" />{errors.name ? <FieldError id="teacher-name-error">{errors.name}</FieldError> : null}</Field>
              <Field><FieldLabel htmlFor="teacher-bio">Biografía breve</FieldLabel><Textarea id="teacher-bio" name="bio" rows={5} value={draft.bio ?? ""} onChange={(event) => setValue("bio", event.target.value)} placeholder="Experiencia, formación y rol dentro del club." /><FieldDescription>Se utilizará como presentación breve cuando el profesor aparezca públicamente.</FieldDescription></Field>
            </FieldGroup>
          </FormSection>

          <FormSection title="Contacto" description="El teléfono de WhatsApp es el canal principal de consulta.">
            <FieldGroup>
              <FormGrid>
                <Field data-invalid={!!errors.phone}><FieldLabel htmlFor="teacher-phone">Teléfono / WhatsApp</FieldLabel><Input id="teacher-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={draft.phone} onChange={(event) => setValue("phone", event.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "teacher-phone-error" : "teacher-phone-help"} placeholder="+54 9 221 123-4567" /><FieldDescription id="teacher-phone-help">Vista previa: {draft.phone ? formatPhoneForDisplay(draft.phone) : "+54 9 221 123-4567"}. Se normalizará antes de guardar.</FieldDescription>{errors.phone ? <FieldError id="teacher-phone-error">{errors.phone}</FieldError> : null}</Field>
                <Field data-invalid={!!errors.email}><FieldLabel htmlFor="teacher-email">Email <span className="font-normal text-muted-foreground">(opcional)</span></FieldLabel><Input id="teacher-email" name="email" type="email" inputMode="email" autoComplete="email" value={draft.email ?? ""} onChange={(event) => setValue("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "teacher-email-error" : undefined} placeholder="profesor@eraclub.com.ar" />{errors.email ? <FieldError id="teacher-email-error">{errors.email}</FieldError> : null}</Field>
              </FormGrid>
            </FieldGroup>
          </FormSection>

          <FormSection title="Foto" description="Imagen opcional utilizada como avatar en el sitio y el panel.">
            <TeacherImageField name={draft.name} image={draft.image} onChange={(image) => setValue("image", image)} />
          </FormSection>
        </div>

        <aside className="flex min-w-0 flex-col gap-4 xl:col-span-4" aria-label="Estado del profesor">
          <FormSection title="Estado" description="Controla si puede seleccionarse para nuevas asignaciones y mostrarse públicamente.">
            <FieldGroup>
              <Field orientation="horizontal"><Switch id="teacher-active" checked={draft.isActive} onCheckedChange={(checked) => setValue("isActive", checked)} /><FieldContent><FieldLabel htmlFor="teacher-active">Profesor activo</FieldLabel><FieldDescription>{draft.isActive ? "Disponible para nuevas asignaciones." : "No disponible para nuevas asignaciones ni presentación pública."}</FieldDescription></FieldContent></Field>
              {!draft.isActive && assignments.length ? <Alert><TriangleAlertIcon aria-hidden="true" /><AlertTitle>Tiene asignaciones actuales</AlertTitle><AlertDescription>Al guardar, dejará de mostrarse públicamente, pero sus {assignments.length} {assignments.length === 1 ? "relación no se eliminará" : "relaciones no se eliminarán"} automáticamente.</AlertDescription></Alert> : null}
            </FieldGroup>
          </FormSection>

          <FormSection title="Resumen" description="Referencia rápida del perfil actual.">
            <dl className="grid gap-3 text-sm">
              <div><dt className="text-muted-foreground">Contacto</dt><dd className="font-medium tabular-nums">{draft.phone ? formatPhoneForDisplay(draft.phone) : "Sin completar"}</dd></div>
              <div><dt className="text-muted-foreground">Asignaciones</dt><dd className="font-medium tabular-nums">{assignments.length}</dd></div>
              <div><dt className="text-muted-foreground">Gestión</dt><dd className="text-pretty">Las asignaciones se editan exclusivamente desde Disciplinas.</dd></div>
            </dl>
          </FormSection>
        </aside>

        <section id="asignaciones" className="scroll-mt-24 xl:col-span-12" aria-labelledby="teacher-assignments-title">
          <FormSection title="Asignaciones" description="Relaciones de solo lectura calculadas desde responsables y categorías de Disciplinas.">
            <h2 id="teacher-assignments-title" className="sr-only">Asignaciones del profesor</h2>
            <TeacherAssignments assignments={assignments} />
          </FormSection>
        </section>

        <div className="xl:col-span-12">
          <FormActions>
            <Button type="button" variant="outline" render={<Link href="/admin/profesores" />} nativeButton={false}>Cancelar</Button>
            <Button type="submit" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear profesor" : "Guardar cambios"}</Button>
          </FormActions>
        </div>
      </form>
    </div>
  )
}

export { TeacherForm }

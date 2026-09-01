"use client"

import { useState } from "react"
import { SaveIcon } from "lucide-react"

import { FormActions, FormSection } from "@/components/admin/admin-form"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SettingsNav } from "@/components/admin/settings/settings-nav"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { siteConfig } from "@/config/site"

function GeneralSettingsForm() {
  const [draft, setDraft] = useState({ clubName: siteConfig.clubName, shortName: siteConfig.shortName, descriptor: siteConfig.descriptor, description: siteConfig.description })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const save = () => {
    const next: Record<string, string> = {}
    if (!draft.clubName.trim()) next.clubName = "Ingresá el nombre oficial."
    if (!draft.shortName.trim()) next.shortName = "Ingresá el nombre corto."
    if (!draft.descriptor.trim()) next.descriptor = "Ingresá el descriptor."
    if (!draft.description.trim()) next.description = "Ingresá una descripción breve."
    setErrors(next); if (Object.keys(next).length) return
    toast.add({ title: "Datos generales actualizados", description: "El cambio se mantiene durante esta sesión.", type: "success" })
  }
  const field = (key: keyof typeof draft, label: string, description: string) => <Field data-invalid={!!errors[key]}><FieldLabel htmlFor={`general-${key}`}>{label}</FieldLabel><Input id={`general-${key}`} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} aria-invalid={!!errors[key]} aria-describedby={`general-${key}-description${errors[key] ? ` general-${key}-error` : ""}`} /><FieldDescription id={`general-${key}-description`}>{description}</FieldDescription>{errors[key] ? <FieldError id={`general-${key}-error`}>{errors[key]}</FieldError> : null}</Field>
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Datos generales" description="Gestioná la identidad básica utilizada por el sitio y el panel." breadcrumbs={[{ label: "Configuración" }, { label: "Datos generales" }]} /><SettingsNav /><div className="max-w-3xl"><FormSection title="Identidad del club" description="El contenido editorial de Home y Club se administra en Contenido institucional."><FieldGroup>{field("clubName", "Nombre oficial del club", "Nombre completo utilizado en títulos y textos legales básicos.")}{field("shortName", "Nombre corto", "Versión compacta utilizada por la marca y el panel.")}{field("descriptor", "Descriptor", "Categoría breve mostrada junto al nombre.")}<Field data-invalid={!!errors.description}><FieldLabel htmlFor="general-description">Descripción institucional breve</FieldLabel><Textarea id="general-description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={4} aria-invalid={!!errors.description} aria-describedby={errors.description ? "general-description-error" : undefined} />{errors.description ? <FieldError id="general-description-error">{errors.description}</FieldError> : null}</Field><FormActions><Button onClick={save}><SaveIcon data-icon="inline-start" aria-hidden="true" />Guardar datos generales</Button></FormActions></FieldGroup></FormSection></div></div>
}

export { GeneralSettingsForm }

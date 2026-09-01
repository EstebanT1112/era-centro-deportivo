"use client"

import { useState } from "react"
import { SaveIcon } from "lucide-react"

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SettingsNav } from "@/components/admin/settings/settings-nav"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { siteConfig } from "@/config/site"
import type { OpeningHour } from "@/types"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlPattern = /^https?:\/\/.+/i
const normalizePhone = (value: string) => value.replace(/\D/g, "")

function ContactSettingsForm() {
  const instagram = siteConfig.socials.find((social) => social.label === "Instagram")?.href ?? ""
  const facebook = siteConfig.socials.find((social) => social.label === "Facebook")?.href ?? ""
  const [draft, setDraft] = useState({ phone: siteConfig.contact.phone.display, whatsapp: siteConfig.contact.whatsapp.display, email: siteConfig.contact.email.display, address: siteConfig.contact.address, mapUrl: siteConfig.contact.mapUrl, instagram, facebook, openingHours: siteConfig.contact.openingHours.map((day) => ({ ...day })) })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const setValue = (key: "phone" | "whatsapp" | "email" | "address" | "mapUrl" | "instagram" | "facebook", value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const updateDay = (weekday: number, patch: Partial<OpeningHour>) => setDraft((current) => ({ ...current, openingHours: current.openingHours.map((day) => day.weekday === weekday ? { ...day, ...patch } : day) }))
  const save = () => {
    const next: Record<string, string> = {}
    if (normalizePhone(draft.phone).length < 10) next.phone = "Ingresá un teléfono válido."
    if (normalizePhone(draft.whatsapp).length < 10) next.whatsapp = "Ingresá un número compatible con WhatsApp."
    if (!emailPattern.test(draft.email)) next.email = "Ingresá un email válido."
    if (!draft.address.trim()) next.address = "Ingresá la dirección."
    if (draft.instagram && !urlPattern.test(draft.instagram)) next.instagram = "Ingresá una URL completa."
    if (draft.facebook && !urlPattern.test(draft.facebook)) next.facebook = "Ingresá una URL completa."
    if (draft.mapUrl && !urlPattern.test(draft.mapUrl)) next.mapUrl = "Ingresá una URL completa o dejá el campo vacío."
    if (draft.openingHours.some((day) => day.enabled && (!day.openTime || !day.closeTime))) next.openingHours = "Completá apertura y cierre en todos los días habilitados."
    setErrors(next); if (Object.keys(next).length) return
    toast.add({ title: "Información de contacto actualizada", description: "Los valores normalizados se mantienen durante esta sesión.", type: "success" })
  }
  const textField = (key: "phone" | "whatsapp" | "email" | "address" | "mapUrl" | "instagram" | "facebook", label: string, description: string, type = "text") => <Field data-invalid={!!errors[key]}><FieldLabel htmlFor={`contact-${key}`}>{label}</FieldLabel><Input id={`contact-${key}`} type={type} value={draft[key]} onChange={(event) => setValue(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={`contact-${key}-description${errors[key] ? ` contact-${key}-error` : ""}`} /><FieldDescription id={`contact-${key}-description`}>{description}</FieldDescription>{errors[key] ? <FieldError id={`contact-${key}-error`}>{errors[key]}</FieldError> : null}</Field>
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Contacto y redes" description="Actualizá los canales institucionales utilizados como referencia por todo el sitio." breadcrumbs={[{ label: "Configuración" }, { label: "Contacto y redes" }]} /><SettingsNav /><div className="grid max-w-5xl gap-5 xl:grid-cols-2"><FormSection title="Datos de contacto" description="Teléfono y WhatsApp cumplen funciones diferentes dentro del producto."><FieldGroup><FormGrid>{textField("phone", "Teléfono", "Número general para llamadas.", "tel")}{textField("whatsapp", "Número de WhatsApp", "Se normaliza a dígitos para generar enlaces wa.me.", "tel")}{textField("email", "Email", "Dirección pública de contacto.", "email")}</FormGrid><Field data-invalid={!!errors.address}><FieldLabel htmlFor="contact-address">Dirección</FieldLabel><Textarea id="contact-address" value={draft.address} onChange={(event) => setValue("address", event.target.value)} rows={3} aria-invalid={!!errors.address} aria-describedby={errors.address ? "contact-address-error" : undefined} />{errors.address ? <FieldError id="contact-address-error">{errors.address}</FieldError> : null}</Field>{textField("mapUrl", "URL del mapa", "Opcional. El prototipo mantiene el mapa ilustrativo si queda vacío.", "url")}</FieldGroup></FormSection><FormSection title="Redes sociales" description="Enlaces públicos utilizados por Home, Contacto y Footer."><FieldGroup>{textField("instagram", "Instagram", "URL completa del perfil institucional.", "url")}{textField("facebook", "Facebook", "URL completa de la página institucional.", "url")}</FieldGroup></FormSection></div>
    <div className="max-w-5xl"><FormSection title="Horarios generales" description="Horario del club; no modifica la disponibilidad particular de cada cancha."><FieldSet aria-invalid={!!errors.openingHours} aria-describedby={errors.openingHours ? "opening-hours-error" : undefined}><FieldLegend variant="label">Semana del club</FieldLegend><FieldDescription>Desactivá un día para mostrarlo como cerrado.</FieldDescription><FieldGroup data-slot="checkbox-group">{draft.openingHours.map((day) => <Field key={day.weekday} orientation="responsive" className="rounded-lg border border-border bg-surface p-3"><Switch id={`opening-${day.weekday}`} checked={day.enabled} onCheckedChange={(checked) => updateDay(day.weekday, { enabled: checked })} /><FieldContent><FieldLabel htmlFor={`opening-${day.weekday}`}>{day.label}</FieldLabel><FieldDescription>{day.enabled ? "Abierto" : "Cerrado"}</FieldDescription></FieldContent><div className="grid grid-cols-2 gap-2"><Input type="time" aria-label={`Apertura del ${day.label}`} value={day.openTime ?? ""} disabled={!day.enabled} onChange={(event) => updateDay(day.weekday, { openTime: event.target.value })} /><Input type="time" aria-label={`Cierre del ${day.label}`} value={day.closeTime ?? ""} disabled={!day.enabled} onChange={(event) => updateDay(day.weekday, { closeTime: event.target.value })} /></div></Field>)}</FieldGroup>{errors.openingHours ? <FieldError id="opening-hours-error">{errors.openingHours}</FieldError> : null}</FieldSet><div className="mt-5"><FormActions><Button onClick={save}><SaveIcon data-icon="inline-start" aria-hidden="true" />Guardar contacto y redes</Button></FormActions></div></FormSection></div></div>
}

export { ContactSettingsForm }

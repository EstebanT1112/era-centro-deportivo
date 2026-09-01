"use client"

import { useRef, useState } from "react"
import { CheckCircle2Icon, SendIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

const reasonItems = [
  { label: "Elegí un motivo", value: null },
  { label: "Reservas y disponibilidad", value: "reservas" },
  { label: "Tienda e indumentaria", value: "tienda" },
  { label: "Actividades del centro", value: "actividades" },
  { label: "Consulta general", value: "general" },
]

type ContactField = "name" | "contact" | "reason" | "message"
type ContactErrors = Partial<Record<ContactField, string>>

function ContactForm() {
  const [values, setValues] = useState({ name: "", contact: "", reason: null as string | null, message: "" })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sent, setSent] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  function validate() {
    const nextErrors: ContactErrors = {}
    if (!values.name.trim()) nextErrors.name = "Ingresá tu nombre."
    if (!values.contact.trim()) nextErrors.contact = "Ingresá un email o teléfono."
    if (!values.reason) nextErrors.reason = "Elegí un motivo."
    if (!values.message.trim()) nextErrors.message = "Escribí tu mensaje."
    return nextErrors
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSent(false)
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }
    setSent(true)
    setValues({ name: "", contact: "", reason: null, message: "" })
    toast.add({ title: "Mensaje enviado correctamente", description: "La confirmación es simulada para este prototipo.", type: "success" })
  }

  function updateField(field: ContactField, value: string | null) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSent(false)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      {Object.keys(errors).length ? <Alert ref={errorSummaryRef} tabIndex={-1} role="alert" aria-label="Revisá los datos marcados" variant="destructive"><AlertTitle>Revisá los datos marcados</AlertTitle><AlertDescription><ul className="mt-2 list-disc pl-5">{Object.entries(errors).map(([field, message]) => <li key={field}><a href={`#contact-${field}`} className="underline">{message}</a></li>)}</ul></AlertDescription></Alert> : null}
      {sent ? <Alert role="status"><CheckCircle2Icon aria-hidden="true" /><AlertTitle>Mensaje enviado correctamente</AlertTitle><AlertDescription>Registramos la consulta de manera simulada. No se envió información fuera del navegador.</AlertDescription></Alert> : null}
      <FieldGroup>
        <Field data-invalid={!!errors.name}><FieldLabel htmlFor="contact-name">Nombre <span aria-hidden="true">*</span></FieldLabel><Input id="contact-name" required autoComplete="name" value={values.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} />{errors.name ? <FieldError id="contact-name-error">{errors.name}</FieldError> : null}</Field>
        <Field data-invalid={!!errors.contact}><FieldLabel htmlFor="contact-contact">Email o teléfono <span aria-hidden="true">*</span></FieldLabel><Input id="contact-contact" required autoComplete="email" value={values.contact} onChange={(event) => updateField("contact", event.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "contact-contact-error" : undefined} />{errors.contact ? <FieldError id="contact-contact-error">{errors.contact}</FieldError> : null}</Field>
        <Field data-invalid={!!errors.reason}><FieldLabel htmlFor="contact-reason">Motivo <span aria-hidden="true">*</span></FieldLabel><Select items={reasonItems} value={values.reason} onValueChange={(value) => updateField("reason", value)}><SelectTrigger id="contact-reason" aria-required="true" aria-invalid={!!errors.reason} aria-describedby={errors.reason ? "contact-reason-error" : undefined}><SelectValue /></SelectTrigger><SelectContent alignItemWithTrigger={false}><SelectGroup>{reasonItems.map((item) => <SelectItem key={item.value ?? "placeholder"} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>{errors.reason ? <FieldError id="contact-reason-error">{errors.reason}</FieldError> : null}</Field>
        <Field data-invalid={!!errors.message}><FieldLabel htmlFor="contact-message">Mensaje <span aria-hidden="true">*</span></FieldLabel><Textarea id="contact-message" required value={values.message} onChange={(event) => updateField("message", event.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} placeholder="Contanos cómo podemos ayudarte." rows={6} />{errors.message ? <FieldError id="contact-message-error">{errors.message}</FieldError> : null}</Field>
      </FieldGroup>
      <Button type="submit" size="lg"><SendIcon data-icon="inline-start" />Enviar mensaje</Button>
      <p className="text-sm text-pretty text-muted-foreground">Este formulario es visual: no ejecuta fetch, API, email ni Server Action.</p>
    </form>
  )
}

export { ContactForm }

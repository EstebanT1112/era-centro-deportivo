"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon, CircleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type {
  CustomerErrors,
  CustomerField,
  ReservationDraft,
} from "@/features/reservations/types"

function validateCustomer(draft: ReservationDraft): CustomerErrors {
  const errors: CustomerErrors = {}
  const phoneDigits = draft.phone.replace(/\D/g, "")

  if (!draft.firstName.trim()) errors.firstName = "Ingresá tu nombre."
  if (!draft.lastName.trim()) errors.lastName = "Ingresá tu apellido."
  if (!draft.phone.trim()) {
    errors.phone = "Ingresá un teléfono o WhatsApp."
  } else if (phoneDigits.length < 8) {
    errors.phone = "Ingresá un teléfono válido."
  }
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
    errors.email = "Ingresá un email válido."
  }
  if (
    draft.playerCount !== undefined &&
    (!Number.isInteger(draft.playerCount) || draft.playerCount <= 0)
  ) {
    errors.playerCount = "Ingresá una cantidad positiva de jugadores."
  }

  return errors
}

interface CustomerStepProps {
  draft: ReservationDraft
  onChange: (draft: ReservationDraft) => void
  onBack: () => void
  onContinue: () => void
}

function CustomerStep({ draft, onChange, onBack, onContinue }: CustomerStepProps) {
  const [errors, setErrors] = useState<CustomerErrors>({})
  const [submitAttempt, setSubmitAttempt] = useState(0)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submitAttempt > 0) errorSummaryRef.current?.focus()
  }, [submitAttempt])

  function updateField(field: CustomerField | "notes", value: string | number | undefined) {
    onChange({ ...draft, [field]: value })
    if (field !== "notes" && errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCustomer(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      setSubmitAttempt((current) => current + 1)
      return
    }

    onContinue()
  }

  const errorEntries = Object.entries(errors) as Array<[CustomerField, string]>

  return (
    <form id="customer-form" noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      {errorEntries.length ? (
        <Alert
          ref={errorSummaryRef}
          variant="destructive"
          tabIndex={-1}
          aria-labelledby="customer-errors-title"
          className="focus-visible:ring-2 focus-visible:ring-destructive/25"
        >
          <CircleAlertIcon />
          <AlertTitle id="customer-errors-title">Revisá los datos marcados</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc pl-4">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`}>{message}</a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.firstName)}>
            <FieldLabel htmlFor="firstName">
              Nombre <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              value={draft.firstName}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
            {errors.firstName ? <FieldError id="firstName-error">{errors.firstName}</FieldError> : null}
          </Field>

          <Field data-invalid={Boolean(errors.lastName)}>
            <FieldLabel htmlFor="lastName">
              Apellido <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
              value={draft.lastName}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
            {errors.lastName ? <FieldError id="lastName-error">{errors.lastName}</FieldError> : null}
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="phone">
              Teléfono / WhatsApp <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="Ej. 11 5555-1234"
              value={draft.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-description phone-error" : "phone-description"}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            <FieldDescription id="phone-description">Podés incluir código de área y prefijo internacional.</FieldDescription>
            {errors.phone ? <FieldError id="phone-error">{errors.phone}</FieldError> : null}
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email <span className="font-normal text-muted-foreground">(opcional)</span></FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={draft.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {errors.email ? <FieldError id="email-error">{errors.email}</FieldError> : null}
          </Field>
        </FieldGroup>

        <Field data-invalid={Boolean(errors.playerCount)}>
          <FieldLabel htmlFor="playerCount">Cantidad de jugadores <span className="font-normal text-muted-foreground">(opcional)</span></FieldLabel>
          <Input
            id="playerCount"
            name="playerCount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={draft.playerCount ?? ""}
            aria-invalid={Boolean(errors.playerCount)}
            aria-describedby={errors.playerCount ? "playerCount-error" : undefined}
            onChange={(event) =>
              updateField(
                "playerCount",
                event.target.value ? Number(event.target.value) : undefined
              )
            }
          />
          {errors.playerCount ? <FieldError id="playerCount-error">{errors.playerCount}</FieldError> : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Observaciones <span className="font-normal text-muted-foreground">(opcional)</span></FieldLabel>
          <Textarea
            id="notes"
            name="notes"
            maxLength={300}
            placeholder="Contanos si necesitás algo para el turno."
            value={draft.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
          <FieldDescription>Hasta 300 caracteres.</FieldDescription>
        </Field>
      </FieldGroup>

      <Separator />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Volver al horario
        </Button>
        <Button type="submit" size="lg">
          Revisar reserva
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </form>
  )
}

export { CustomerStep }

"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon, LogInIcon, ShieldCheckIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginField = "email" | "password"
type LoginErrors = Partial<Record<LoginField, string>>

function AdminLoginForm() {
  const router = useRouter()
  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  function updateField(field: LoginField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: LoginErrors = {}
    if (!values.email.trim()) nextErrors.email = "Ingresá tu email."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Ingresá un email válido."
    if (!values.password) nextErrors.password = "Ingresá tu contraseña."
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    router.push("/admin")
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {Object.keys(errors).length ? (
        <Alert ref={errorSummaryRef} tabIndex={-1} variant="destructive" role="alert" aria-label="Revisá los datos de acceso">
          <ShieldCheckIcon aria-hidden="true" />
          <AlertTitle>Revisá los datos de acceso</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(errors).map(([field, message]) => <li key={field}><a href={`#admin-login-${field}`} className="underline underline-offset-2">{message}</a></li>)}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="admin-login-email">Email <span aria-hidden="true">*</span></FieldLabel>
          <Input
            id="admin-login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            required
            autoFocus
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "admin-login-email-error" : undefined}
          />
          {errors.email ? <FieldError id="admin-login-email-error">{errors.email}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(errors.password)}>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="admin-login-password">Contraseña <span aria-hidden="true">*</span></FieldLabel>
            <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={() => setShowPassword((current) => !current)} aria-controls="admin-login-password" aria-pressed={showPassword}>
              {showPassword ? <EyeOffIcon data-icon="inline-start" aria-hidden="true" /> : <EyeIcon data-icon="inline-start" aria-hidden="true" />}
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
          <Input
            id="admin-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "admin-login-password-error" : undefined}
          />
          {errors.password ? <FieldError id="admin-login-password-error">{errors.password}</FieldError> : null}
        </Field>
      </FieldGroup>
      <Button type="submit" size="lg" className="w-full">
        <LogInIcon data-icon="inline-start" aria-hidden="true" />
        Ingresar
      </Button>
    </form>
  )
}

export { AdminLoginForm }

"use client"

import { useEffect } from "react"
import { CreditCardIcon, ShieldCheckIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

interface PaymentStatusStepProps {
  mode: "redirect" | "verification"
  onComplete: () => void
}

function PaymentStatusStep({ mode, onComplete }: PaymentStatusStepProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, mode === "redirect" ? 1400 : 2200)
    return () => window.clearTimeout(timeout)
  }, [mode, onComplete])

  const redirecting = mode === "redirect"
  const Icon = redirecting ? CreditCardIcon : ShieldCheckIcon

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-80 flex-col items-center justify-center gap-5 text-center"
    >
      <span className="relative flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-8" aria-hidden="true" />
        <Spinner
          role="presentation"
          aria-hidden="true"
          className="absolute -right-1 -bottom-1 size-7 rounded-full bg-surface p-1 text-primary shadow-subtle"
        />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <p className="font-display text-h3 text-balance">
          {redirecting ? "Redirigiendo a Mercado Pago..." : "Verificando el pago..."}
        </p>
        <p className="text-pretty text-muted-foreground">
          {redirecting
            ? "Estamos preparando la simulación de pago de tu seña."
            : "Confirmamos el resultado simulado antes de crear tu reserva."}
        </p>
      </div>
    </div>
  )
}

export { PaymentStatusStep }

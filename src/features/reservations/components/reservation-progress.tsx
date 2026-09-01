import { CheckIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { ReservationStep } from "@/features/reservations/types"

const progressSteps = [
  { key: "court", label: "Cancha" },
  { key: "schedule", label: "Fecha y horario" },
  { key: "customer", label: "Tus datos" },
  { key: "summary", label: "Resumen" },
  { key: "payment", label: "Pago" },
  { key: "success", label: "Confirmación" },
] as const

function getProgressIndex(step: ReservationStep) {
  if (step === "redirect" || step === "verification") return 4
  if (step === "success") return 5
  return progressSteps.findIndex((item) => item.key === step)
}

interface ReservationProgressProps {
  step: ReservationStep
}

function ReservationProgress({ step }: ReservationProgressProps) {
  const currentIndex = getProgressIndex(step)
  const current = progressSteps[currentIndex]
  const percentage = ((currentIndex + 1) / progressSteps.length) * 100

  return (
    <nav aria-label="Progreso de la reserva">
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">
            Paso {currentIndex + 1} de {progressSteps.length}: {current.label}
          </span>
          <span className="tabular-nums text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
        <Progress
          value={percentage}
          aria-label={`Paso ${currentIndex + 1} de ${progressSteps.length}: ${current.label}`}
        />
      </div>

      <ol className="hidden grid-cols-6 md:grid">
        {progressSteps.map((item, index) => {
          const completed = index < currentIndex
          const active = index === currentIndex

          return (
            <li
              key={item.key}
              aria-current={active ? "step" : undefined}
              className="relative flex min-w-0 flex-col items-center gap-2 px-1 text-center"
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-4 right-1/2 z-0 h-px w-full bg-border",
                    completed || active ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-bold tabular-nums",
                  completed && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-surface text-primary ring-2 ring-primary/15",
                  !completed && !active && "border-border-strong bg-surface text-muted-foreground"
                )}
              >
                {completed ? <CheckIcon className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
                {completed ? <span className="sr-only">, completado</span> : null}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { ReservationProgress }

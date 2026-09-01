"use client"

import { useEffect, useState } from "react"
import { Clock3Icon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { reservationSettings } from "@/config/reservations"

const INITIAL_SECONDS = reservationSettings.holdMinutes * 60

function ReservationTimer() {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formatted = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`

  return (
    <Alert className="border-warning/35 bg-warning/5">
      <Clock3Icon className="text-warning" />
      <AlertTitle>
        {seconds > 0 ? "Turno retenido visualmente" : "Tiempo de demostración finalizado"}
      </AlertTitle>
      <AlertDescription>
        {seconds > 0 ? (
          <span>
            Completá la reserva dentro de <strong className="tabular-nums text-foreground">{formatted}</strong> min.
          </span>
        ) : (
          "Podés continuar: este temporizador no invalida el turno en el prototipo."
        )}
      </AlertDescription>
    </Alert>
  )
}

export { ReservationTimer }

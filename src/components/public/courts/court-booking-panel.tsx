"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, CalendarClockIcon, WrenchIcon } from "lucide-react"

import { DateSelector } from "@/components/public/courts/date-selector"
import { TimeSlotGrid } from "@/components/public/courts/time-slot-grid"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Court, CourtTimeSlot } from "@/types"

interface CourtBookingPanelProps {
  court: Court
  availability: Record<string, CourtTimeSlot[]>
  dates: string[]
}

function CourtBookingPanel({ court, availability, dates }: CourtBookingPanelProps) {
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "")
  const [selectedSlot, setSelectedSlot] = useState<CourtTimeSlot | null>(null)
  const reservable = court.status === "active"

  function handleDateChange(date: string) {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const reservationHref = selectedSlot
    ? `/reservas?${new URLSearchParams({
        court: court.slug,
        date: selectedDate,
        time: selectedSlot.startTime,
      }).toString()}`
    : "#"

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border pb-5">
        <div>
          <p className="type-caption mb-1 font-semibold uppercase tracking-[0.12em] text-primary">
            Disponibilidad simulada
          </p>
          <CardTitle>
            <h2 className="font-display text-h2">Elegí cuándo jugar</h2>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-7">
        {!reservable ? (
          <Alert className="border-warning/35 bg-warning/5 text-foreground">
            <WrenchIcon className="text-warning" />
            <AlertTitle>
              {court.status === "maintenance" ? "Cancha en mantenimiento" : "Cancha no disponible"}
            </AlertTitle>
            <AlertDescription>
              Por el momento no se pueden consultar ni seleccionar turnos para esta cancha.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <DateSelector dates={dates} value={selectedDate} onValueChange={handleDateChange} />
            <TimeSlotGrid
              slots={availability[selectedDate] ?? []}
              selectedSlotId={selectedSlot?.id}
              onSelect={setSelectedSlot}
            />

            <div className="rounded-lg border border-border bg-background-subtle p-4 sm:p-5">
              {selectedSlot ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <CalendarClockIcon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">Tu selección</p>
                      <p className="text-sm text-muted-foreground">
                        {court.name} · {formatDate(selectedDate)} · {selectedSlot.startTime} h
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(court.pricePerSlot)} por turno
                      </p>
                    </div>
                  </div>
                  <Link
                    href={reservationHref}
                    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full md:w-auto")}
                  >
                    Continuar reserva
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Seleccioná un horario disponible para ver el resumen y continuar a Reservas.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export { CourtBookingPanel }

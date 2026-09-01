"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { DateSelector } from "@/components/public/courts/date-selector"
import { TimeSlotGrid } from "@/components/public/courts/time-slot-grid"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { CourtTimeSlot } from "@/types"

interface ScheduleStepProps {
  dates: string[]
  selectedDate?: string
  selectedTime?: string
  slots: CourtTimeSlot[]
  onDateChange: (date: string) => void
  onTimeChange: (slot: CourtTimeSlot) => void
  onBack: () => void
  onContinue: () => void
}

function ScheduleStep({
  dates,
  selectedDate,
  selectedTime,
  slots,
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}: ScheduleStepProps) {
  return (
    <div className="flex flex-col gap-7">
      <DateSelector
        dates={dates}
        value={selectedDate ?? ""}
        onValueChange={onDateChange}
      />
      {selectedDate ? (
        <TimeSlotGrid
          slots={slots}
          selectedSlotId={slots.find((slot) => slot.startTime === selectedTime)?.id}
          onSelect={onTimeChange}
        />
      ) : (
        <p className="rounded-md border border-dashed border-border-strong bg-muted p-4 text-sm text-muted-foreground">
          Primero seleccioná una fecha para consultar los horarios simulados.
        </p>
      )}
      <Separator />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Cambiar cancha
        </Button>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {!selectedTime ? (
            <p className="text-sm text-muted-foreground">Elegí un horario disponible para continuar.</p>
          ) : null}
          <Button size="lg" disabled={!selectedTime} onClick={onContinue}>
            Continuar con tus datos
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ScheduleStep }

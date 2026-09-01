"use client"

import { TimeSlot } from "@/components/public/courts/time-slot"
import type { CourtTimeSlot } from "@/types"

interface TimeSlotGridProps {
  slots: CourtTimeSlot[]
  selectedSlotId?: string
  onSelect: (slot: CourtTimeSlot) => void
}

function TimeSlotGrid({ slots, selectedSlotId, onSelect }: TimeSlotGridProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-foreground">Elegí un horario</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {slots.map((slot) => (
          <TimeSlot
            key={slot.id}
            slot={slot}
            selected={slot.id === selectedSlotId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span>Disponible: seleccionable</span>
        <span>Ocupado: ya reservado</span>
        <span>Bloqueado: fuera de venta</span>
      </div>
    </fieldset>
  )
}

export { TimeSlotGrid }

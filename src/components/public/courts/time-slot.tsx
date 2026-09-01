"use client"

import { BanIcon, CheckIcon, Clock3Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CourtTimeSlot } from "@/types"

interface TimeSlotProps {
  slot: CourtTimeSlot
  selected: boolean
  onSelect: (slot: CourtTimeSlot) => void
}

const statusLabels = {
  available: "Disponible",
  occupied: "Ocupado",
  blocked: "Bloqueado",
} as const

function TimeSlot({ slot, selected, onSelect }: TimeSlotProps) {
  const disabled = slot.status !== "available"
  const StatusIcon = selected ? CheckIcon : slot.status === "blocked" ? BanIcon : Clock3Icon
  const label = selected ? "Seleccionado" : statusLabels[slot.status]

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${slot.startTime}, ${label}`}
      onClick={() => onSelect(slot)}
      className={cn(
        "flex min-h-16 flex-col items-start justify-center gap-1 rounded-md border px-3 py-2 text-left transition-[background-color,border-color,box-shadow] duration-150 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        slot.status === "available" &&
          "border-success/35 bg-success/5 text-foreground hover:border-success hover:bg-success/10",
        slot.status === "occupied" &&
          "cursor-not-allowed border-info/20 bg-info/5 text-muted-foreground opacity-70",
        slot.status === "blocked" &&
          "cursor-not-allowed border-dashed border-border-strong bg-muted text-muted-foreground opacity-70",
        selected && "border-primary bg-primary text-primary-foreground shadow-subtle hover:bg-primary"
      )}
    >
      <strong className="text-sm tabular-nums">{slot.startTime}</strong>
      <span className="flex items-center gap-1 text-xs font-medium">
        <StatusIcon className="size-3.5" aria-hidden="true" />
        {label}
      </span>
    </button>
  )
}

export { TimeSlot }

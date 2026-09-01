"use client"

import { ArrowRightIcon } from "lucide-react"

import { CourtCard } from "@/components/public/cards/court-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Court } from "@/types"

interface CourtStepProps {
  courts: Court[]
  selectedCourtId?: string
  onSelect: (court: Court) => void
  onContinue: () => void
}

function CourtStep({ courts, selectedCourtId, onSelect, onContinue }: CourtStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {courts.map((court) => (
          <CourtCard
            key={court.id}
            court={court}
            mode="select"
            selected={court.id === selectedCourtId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <Separator />
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        {!selectedCourtId ? (
          <p className="text-sm text-muted-foreground">Elegí una cancha disponible para continuar.</p>
        ) : null}
        <Button size="lg" disabled={!selectedCourtId} onClick={onContinue}>
          Continuar con fecha y horario
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

export { CourtStep }

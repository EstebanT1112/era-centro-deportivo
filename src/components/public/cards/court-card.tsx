import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  Clock3Icon,
  LightbulbIcon,
  PanelsTopLeftIcon,
} from "lucide-react"

import { CourtStatusBadge } from "@/components/public/courts/court-status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { COURT_TYPES } from "@/constants/domain"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Court } from "@/types"

interface CourtCardProps {
  court: Court
  variant?: "default" | "featured"
  mode?: "link" | "select"
  selected?: boolean
  onSelect?: (court: Court) => void
}

function CourtCard({
  court,
  variant = "default",
  mode = "link",
  selected = false,
  onSelect,
}: CourtCardProps) {
  const type = COURT_TYPES.find((item) => item.value === court.type)?.label
  const reservable = court.status === "active"

  return (
    <Card
      interactive={mode === "link" || reservable}
      className={cn("h-full", selected && "border-primary ring-2 ring-primary/15")}
    >
      <div
        className={cn(
          "relative -mt-(--card-spacing) aspect-[16/10] overflow-hidden bg-muted",
          variant === "featured" && "md:aspect-[4/3]"
        )}
      >
        <Image
          src={court.images[0]}
          alt={`Vista de ${court.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div>
          <p className="type-caption text-primary">{type}</p>
          <CardTitle className="mt-1">
            <h3 className="font-display text-h3 text-balance">{court.name}</h3>
          </CardTitle>
        </div>
        <CardAction>
          <CourtStatusBadge status={court.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-sm text-pretty text-muted-foreground">
          {court.surface} · Turnos de {court.slotMinutes} minutos
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3Icon className="size-4" aria-hidden="true" />
          <span>Desde</span>
          <strong className="tabular-nums text-foreground">
            {formatCurrency(court.pricePerSlot)}
          </strong>
        </div>
        <div className="flex flex-wrap gap-2 pt-1" aria-label="Características">
          {court.features.includes("Techada") ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
              <PanelsTopLeftIcon className="size-3.5 text-primary" aria-hidden="true" />
              Techada
            </span>
          ) : null}
          {court.features.includes("Iluminación") ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
              <LightbulbIcon className="size-3.5 text-primary" aria-hidden="true" />
              Iluminación
            </span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        {mode === "select" ? (
          <Button
            type="button"
            disabled={!reservable}
            aria-pressed={selected}
            onClick={() => onSelect?.(court)}
            variant={selected ? "primary" : "outline"}
            className="w-full"
          >
            {selected ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Cancha seleccionada
              </>
            ) : reservable ? (
              "Seleccionar cancha"
            ) : (
              "No se puede reservar"
            )}
          </Button>
        ) : (
          <Link
            href={`/canchas/${court.slug}`}
            className={cn(
              buttonVariants({ variant: reservable ? "secondary" : "outline" }),
              "w-full"
            )}
          >
            {reservable ? "Ver disponibilidad" : "Ver cancha"}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

export { CourtCard }

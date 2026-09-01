"use client"

import { CalendarDaysIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const weekdayFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  timeZone: "UTC",
})
const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
})

interface DateSelectorProps {
  dates: string[]
  value: string
  onValueChange: (value: string) => void
}

function DateSelector({ dates, value, onValueChange }: DateSelectorProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarDaysIcon className="size-4 text-primary" aria-hidden="true" />
        Elegí una fecha
      </legend>
      <div className="overflow-x-auto pb-2">
        <ToggleGroup
          value={[value]}
          onValueChange={(values) => {
            const nextValue = values.at(-1)
            if (nextValue) onValueChange(nextValue)
          }}
          variant="outline"
          spacing={2}
          className="min-w-max"
          aria-label="Fechas disponibles"
        >
          {dates.map((date) => {
            const parsedDate = new Date(`${date}T12:00:00Z`)
            return (
              <ToggleGroupItem
                key={date}
                value={date}
                className="h-auto min-w-20 flex-col gap-0.5 px-3 py-2.5 capitalize aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                <span className="text-xs font-medium">{weekdayFormatter.format(parsedDate)}</span>
                <span>{dateFormatter.format(parsedDate)}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>
    </fieldset>
  )
}

export { DateSelector }

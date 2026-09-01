"use client"

import { useMemo, useState } from "react"
import { FilterIcon, SearchXIcon, XIcon } from "lucide-react"

import { CourtCard } from "@/components/public/cards/court-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { COURT_FEATURES, COURT_TYPES } from "@/constants/domain"
import type { Court, CourtFeature, CourtType } from "@/types"

type CourtTypeFilter = "all" | CourtType
type FeatureFilter = CourtFeature

interface FilterControlsProps {
  idPrefix: string
  type: CourtTypeFilter
  features: FeatureFilter[]
  onTypeChange: (value: CourtTypeFilter) => void
  onFeatureChange: (value: FeatureFilter, checked: boolean) => void
}

function FilterControls({
  idPrefix,
  type,
  features,
  onTypeChange,
  onFeatureChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-7">
      <FieldSet>
        <FieldLegend variant="label">Tipo de cancha</FieldLegend>
        <ToggleGroup
          value={[type]}
          onValueChange={(values) => {
            const nextValue = values.at(-1) as CourtTypeFilter | undefined
            if (nextValue) onTypeChange(nextValue)
          }}
          variant="outline"
          orientation="vertical"
          className="w-full items-stretch"
          aria-label="Filtrar por tipo de cancha"
        >
          <ToggleGroupItem value="all" className="w-full justify-start">
            Todas
          </ToggleGroupItem>
          {COURT_TYPES.map((courtType) => (
            <ToggleGroupItem
              key={courtType.value}
              value={courtType.value}
              className="w-full justify-start"
            >
              {courtType.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Características</FieldLegend>
        <FieldGroup data-slot="checkbox-group">
        {COURT_FEATURES.map(({ value: feature, label }) => {
            const id = `${idPrefix}-${feature.toLowerCase()}`
            return (
              <Field key={feature} orientation="horizontal">
                <Checkbox
                  id={id}
                  checked={features.includes(feature)}
                  onCheckedChange={(checked) => onFeatureChange(feature, checked)}
                />
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
              </Field>
            )
          })}
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

interface CourtCatalogProps {
  courts: Court[]
}

function CourtCatalog({ courts }: CourtCatalogProps) {
  const [type, setType] = useState<CourtTypeFilter>("all")
  const [features, setFeatures] = useState<FeatureFilter[]>([])

  const filteredCourts = useMemo(
    () =>
      courts.filter(
        (court) =>
          (type === "all" || court.type === type) &&
          features.every((feature) => court.features.includes(feature))
      ),
    [courts, features, type]
  )

  const activeFilterCount = (type === "all" ? 0 : 1) + features.length
  const hasActiveFilters = activeFilterCount > 0
  const activeFilterLabels = [
    ...(type === "all"
      ? []
      : [COURT_TYPES.find((courtType) => courtType.value === type)?.label ?? type]),
    ...features,
  ]

  function handleFeatureChange(feature: FeatureFilter, checked: boolean) {
    setFeatures((current) =>
      checked ? [...current, feature] : current.filter((item) => item !== feature)
    )
  }

  function clearFilters() {
    setType("all")
    setFeatures([])
  }

  const filterControls = (idPrefix: string) => (
    <FilterControls
      idPrefix={idPrefix}
      type={type}
      features={features}
      onTypeChange={setType}
      onFeatureChange={handleFeatureChange}
    />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filtros de canchas">
        <div className="sticky top-24 rounded-lg border border-border bg-surface p-5 shadow-subtle">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="type-h4">Filtrar</h2>
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            ) : null}
          </div>
          {filterControls("desktop-filter")}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <strong className="font-semibold text-foreground">{filteredCourts.length}</strong>{" "}
            {filteredCourts.length === 1 ? "cancha encontrada" : "canchas encontradas"}
          </p>

          <div className="flex items-center gap-2 lg:hidden">
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <XIcon data-icon="inline-start" />
                Limpiar
              </Button>
            ) : null}
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <FilterIcon data-icon="inline-start" />
                Filtros{activeFilterCount ? ` (${activeFilterCount})` : ""}
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filtrar canchas</SheetTitle>
                  <SheetDescription>
                    Elegí tipo y características para reducir los resultados.
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto px-5 pb-5">
                  {filterControls("mobile-filter")}
                </div>
                {hasActiveFilters ? (
                  <SheetFooter>
                    <Button variant="outline" onClick={clearFilters}>
                      <XIcon data-icon="inline-start" />
                      Limpiar filtros
                    </Button>
                  </SheetFooter>
                ) : null}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
            <span className="text-xs font-semibold text-muted-foreground">Filtros activos:</span>
            {activeFilterLabels.map((label) => (
              <span
                key={label}
                className="rounded-md border border-primary/25 bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}

        {filteredCourts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchXIcon}
            titleAs="h2"
            title="No encontramos canchas con esos filtros"
            description="Probá otra combinación o limpiá los filtros para volver a ver todas las opciones."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}

export { CourtCatalog }

"use client"

import { useMemo, useState } from "react"
import { FilterIcon, PackageSearchIcon, XIcon } from "lucide-react"

import { ProductCard } from "@/components/public/cards/product-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { FieldLegend, FieldSet } from "@/components/ui/field"
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
import type { Product } from "@/types"
import { PRODUCT_CATEGORIES } from "@/constants/domain"

type AvailabilityFilter = "all" | "available" | "unavailable"

function ProductCatalog({ products }: { products: Product[] }) {
  const categories = useMemo(() => PRODUCT_CATEGORIES.filter((item) => products.some((product) => product.category === item)), [products])
  const [category, setCategory] = useState("all")
  const [availability, setAvailability] = useState<AvailabilityFilter>("all")
  const filteredProducts = products.filter((product) =>
    (category === "all" || product.category === category) &&
    (availability === "all" || (availability === "available" ? product.isAvailable : !product.isAvailable))
  )
  const hasFilters = category !== "all" || availability !== "all"

  function clearFilters() {
    setCategory("all")
    setAvailability("all")
  }

  const filterControls = (
    <div className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend variant="label">Categoría</FieldLegend>
        <ToggleGroup
          value={[category]}
          onValueChange={(values) => {
            const next = values.at(-1)
            if (next) setCategory(next)
          }}
          variant="outline"
          orientation="vertical"
          className="w-full items-stretch"
          aria-label="Filtrar por categoría"
        >
          <ToggleGroupItem value="all" className="w-full justify-start">Todas</ToggleGroupItem>
          {categories.map((item) => <ToggleGroupItem key={item} value={item} className="w-full justify-start">{item}</ToggleGroupItem>)}
        </ToggleGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Disponibilidad</FieldLegend>
        <ToggleGroup
          value={[availability]}
          onValueChange={(values) => {
            const next = values.at(-1) as AvailabilityFilter | undefined
            if (next) setAvailability(next)
          }}
          variant="outline"
          orientation="vertical"
          className="w-full items-stretch"
          aria-label="Filtrar por disponibilidad"
        >
          <ToggleGroupItem value="all" className="w-full justify-start">Todos</ToggleGroupItem>
          <ToggleGroupItem value="available" className="w-full justify-start">Disponibles</ToggleGroupItem>
          <ToggleGroupItem value="unavailable" className="w-full justify-start">No disponibles</ToggleGroupItem>
        </ToggleGroup>
      </FieldSet>
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filtros de productos">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-5 shadow-subtle lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3"><h2 className="type-h4">Filtrar</h2>{hasFilters ? <Button variant="ghost" size="sm" onClick={clearFilters}>Limpiar</Button> : null}</div>
          {filterControls}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground" aria-live="polite"><strong className="font-semibold text-foreground">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "producto" : "productos"}</p>
          <div className="flex items-center gap-2 lg:hidden">
            {hasFilters ? <Button variant="ghost" size="sm" onClick={clearFilters}><XIcon data-icon="inline-start" />Limpiar</Button> : null}
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" />}><FilterIcon data-icon="inline-start" />Filtros</SheetTrigger>
              <SheetContent side="right">
                <SheetHeader><SheetTitle>Filtrar productos</SheetTitle><SheetDescription>Elegí categoría y disponibilidad.</SheetDescription></SheetHeader>
                <div className="overflow-y-auto px-5 pb-5">{filterControls}</div>
                {hasFilters ? <SheetFooter><Button variant="outline" onClick={clearFilters}><XIcon data-icon="inline-start" />Limpiar filtros</Button></SheetFooter> : null}
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {filteredProducts.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState icon={PackageSearchIcon} titleAs="h2" title="No encontramos productos" description="Probá otra combinación o limpiá los filtros." action={<Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>} />}
      </div>
    </div>
  )
}

export { ProductCatalog }

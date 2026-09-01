"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, ImagesIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { GalleryCategory, GalleryItem } from "@/types"

const categoryLabels: Record<GalleryCategory, string> = {
  canchas: "Canchas",
  instalaciones: "Instalaciones",
  partidos: "Partidos",
  club: "Centro",
  otros: "Otros",
}

function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items])
  const [category, setCategory] = useState<"all" | GalleryCategory>("all")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const filteredItems = category === "all" ? items : items.filter((item) => item.category === category)
  const activeItem = activeIndex === null ? null : filteredItems[activeIndex]

  function move(direction: -1 | 1) {
    if (activeIndex === null || !filteredItems.length) return
    setActiveIndex((activeIndex + direction + filteredItems.length) % filteredItems.length)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup value={[category]} onValueChange={(values) => { const next = values.at(-1) as "all" | GalleryCategory | undefined; if (next) { setCategory(next); setActiveIndex(null) } }} variant="outline" className="flex-wrap" aria-label="Filtrar galería por categoría">
          <ToggleGroupItem value="all">Todas</ToggleGroupItem>
          {categories.map((item) => <ToggleGroupItem key={item} value={item}>{categoryLabels[item]}</ToggleGroupItem>)}
        </ToggleGroup>
        <p className="text-sm text-muted-foreground" aria-live="polite">{filteredItems.length} {filteredItems.length === 1 ? "imagen" : "imágenes"}</p>
      </div>

      {filteredItems.length ? <div className="grid auto-rows-[13rem] gap-3 sm:grid-cols-2 md:auto-rows-[16rem] lg:grid-cols-3">{filteredItems.map((item, index) => <button key={item.id} type="button" onClick={() => setActiveIndex(index)} className={cn("group relative overflow-hidden rounded-lg bg-muted text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40", index % 5 === 0 && "md:row-span-2")} aria-label={`Ampliar ${item.title ?? "imagen de la galería"}`}><Image src={item.imageUrl} alt={item.title ?? `Imagen de ${categoryLabels[item.category]}`} fill loading={index < 2 ? "eager" : "lazy"} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" /><span className="absolute inset-x-0 bottom-0 bg-foreground/78 p-4 text-foreground-inverse"><span className="block text-xs font-semibold">{categoryLabels[item.category]}</span><span className="mt-1 block font-display text-h4 text-balance">{item.title}</span></span></button>)}</div> : <EmptyState icon={ImagesIcon} titleAs="h2" title="No hay imágenes en esta categoría" description="Volvé a la galería completa para seguir recorriendo Espacio ERA." action={<Button variant="outline" onClick={() => setCategory("all")}>Ver todas</Button>} />}

      <Dialog open={activeIndex !== null} onOpenChange={(open) => { if (!open) setActiveIndex(null) }}>
        {activeItem ? <DialogContent className="max-w-5xl p-4 sm:max-w-5xl sm:p-5" onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1) }}>
          <DialogHeader className="pr-9"><DialogTitle>{activeItem.title ?? "Galería de Espacio ERA"}</DialogTitle><DialogDescription>{categoryLabels[activeItem.category]} · Imagen {activeIndex! + 1} de {filteredItems.length}</DialogDescription></DialogHeader>
          <div className="relative min-h-[50dvh] overflow-hidden rounded-md bg-foreground"><Image src={activeItem.imageUrl} alt={activeItem.title ?? `Imagen de ${categoryLabels[activeItem.category]}`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-contain" /></div>
          {filteredItems.length > 1 ? <div className="flex items-center justify-between gap-3"><Button type="button" variant="outline" onClick={() => move(-1)}><ChevronLeftIcon data-icon="inline-start" />Anterior</Button><p className="text-sm tabular-nums text-muted-foreground" aria-live="polite">{activeIndex! + 1} / {filteredItems.length}</p><Button type="button" variant="outline" onClick={() => move(1)}>Siguiente<ChevronRightIcon data-icon="inline-end" /></Button></div> : null}
        </DialogContent> : null}
      </Dialog>
    </div>
  )
}

export { GalleryExplorer }

"use client"

import Image from "next/image"
import { ArrowDownIcon, ArrowUpIcon, ImagePlusIcon, StarIcon, Trash2Icon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { DISCIPLINE_IMAGE_OPTIONS } from "@/lib/admin-disciplines"

interface DisciplineImageManagerProps {
  coverImage: string
  images: string[]
  disciplineName: string
  error?: string
  onCoverChange: (value: string) => void
  onImagesChange: (images: string[]) => void
}

function DisciplineImageManager({ coverImage, images, disciplineName, error, onCoverChange, onImagesChange }: DisciplineImageManagerProps) {
  const nextCover = DISCIPLINE_IMAGE_OPTIONS.find((image) => image !== coverImage) ?? DISCIPLINE_IMAGE_OPTIONS[0]
  const nextGalleryImage = DISCIPLINE_IMAGE_OPTIONS.find((image) => image !== coverImage && !images.includes(image))

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onImagesChange(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="discipline-cover-heading" className="flex flex-col gap-3">
        <div><h3 id="discipline-cover-heading" className="font-heading text-sm font-semibold">Imagen principal</h3><p className="text-sm text-pretty text-muted-foreground">Se utiliza en el catálogo público y como portada del detalle.</p></div>
        {coverImage ? <div className="relative aspect-[16/7] overflow-hidden rounded-lg border border-border bg-muted"><Image src={coverImage} alt={`Portada de ${disciplineName || "la nueva disciplina"}`} fill loading="eager" sizes="(max-width: 768px) 100vw, 800px" className="object-cover" /><StatusBadge variant="info" icon={StarIcon} className="absolute top-3 left-3">Portada</StatusBadge></div> : <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">Todavía no seleccionaste una portada.</div>}
        <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={() => onCoverChange(nextCover)}><ImagePlusIcon data-icon="inline-start" aria-hidden="true" />{coverImage ? "Cambiar portada" : "Agregar portada de muestra"}</Button>{coverImage ? <Button type="button" variant="ghost" size="sm" onClick={() => onCoverChange("")}><Trash2Icon data-icon="inline-start" aria-hidden="true" />Quitar portada</Button> : null}</div>
        {error ? <FieldError id="discipline-cover-error">{error}</FieldError> : null}
      </section>

      <section aria-labelledby="discipline-gallery-heading" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id="discipline-gallery-heading" className="font-heading text-sm font-semibold">Galería</h3><p className="text-sm text-pretty text-muted-foreground">La portada se gestiona por separado; la vista pública evita duplicados.</p></div><Button type="button" variant="outline" size="sm" disabled={!nextGalleryImage} onClick={() => nextGalleryImage && onImagesChange([...images, nextGalleryImage])}><ImagePlusIcon data-icon="inline-start" aria-hidden="true" />Agregar imagen de muestra</Button></div>
        {images.length ? <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Imágenes de la disciplina en orden de aparición">{images.map((src, index) => <li key={`${src}-${index}`} className="overflow-hidden rounded-lg border border-border bg-surface"><div className="relative aspect-[16/10] bg-muted"><Image src={src} alt={`Imagen ${index + 1} de ${disciplineName || "la disciplina"}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div><div className="flex items-center justify-between gap-2 p-2"><span className="text-xs tabular-nums text-muted-foreground">Posición {index + 1}</span><div className="flex gap-1"><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia arriba`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUpIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia abajo`} disabled={index === images.length - 1} onClick={() => move(index, 1)}><ArrowDownIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Eliminar imagen ${index + 1}`} onClick={() => onImagesChange(images.filter((_, itemIndex) => itemIndex !== index))}><Trash2Icon aria-hidden="true" /></Button></div></div></li>)}</ol> : <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">No hay imágenes adicionales. La portada es suficiente para publicar.</div>}
      </section>
    </div>
  )
}

export { DisciplineImageManager }

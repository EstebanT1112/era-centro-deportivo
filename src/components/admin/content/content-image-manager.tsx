"use client";

import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, ImagePlusIcon, StarIcon, Trash2Icon } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CONTENT_IMAGE_OPTIONS } from "@/lib/admin-content";

function CoverImageManager({ value, label, onChange }: { value: string; label: string; onChange: (value: string) => void }) {
  const next = CONTENT_IMAGE_OPTIONS.find((image) => image !== value) ?? CONTENT_IMAGE_OPTIONS[0];
  return <div className="flex flex-col gap-3">{value ? <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-border bg-muted"><Image src={value} alt={`Vista previa de portada de ${label || "la noticia"}`} fill loading="eager" sizes="(max-width: 768px) 100vw, 800px" className="object-cover" /></div> : <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">Sin imagen de portada</div>}<div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={() => onChange(next)}><ImagePlusIcon data-icon="inline-start" aria-hidden="true" />{value ? "Reemplazar imagen" : "Agregar imagen de muestra"}</Button>{value ? <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}><Trash2Icon data-icon="inline-start" aria-hidden="true" />Eliminar</Button> : null}</div></div>;
}

function ProductImageManager({ images, label, onChange }: { images: string[]; label: string; onChange: (images: string[]) => void }) {
  const next = CONTENT_IMAGE_OPTIONS.find((image) => !images.includes(image));
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= images.length) return; const copy = [...images]; [copy[index], copy[target]] = [copy[target], copy[index]]; onChange(copy); };
  return <div className="flex flex-col gap-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-pretty text-muted-foreground">La primera imagen es la principal del producto.</p><Button type="button" variant="outline" size="sm" disabled={!next} onClick={() => next && onChange([...images, next])}><ImagePlusIcon data-icon="inline-start" aria-hidden="true" />Agregar imagen de muestra</Button></div>{images.length ? <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Imágenes del producto en orden de aparición">{images.map((src, index) => <li key={`${src}-${index}`} className="overflow-hidden rounded-lg border border-border bg-surface"><div className="relative aspect-square bg-muted"><Image src={src} alt={`Imagen ${index + 1} de ${label || "el producto"}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />{index === 0 ? <StatusBadge variant="info" icon={StarIcon} className="absolute top-2 left-2">Principal</StatusBadge> : null}</div><div className="flex items-center justify-between gap-2 p-2"><span className="text-xs tabular-nums text-muted-foreground">Posición {index + 1}</span><div className="flex gap-1"><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia arriba`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUpIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia abajo`} disabled={index === images.length - 1} onClick={() => move(index, 1)}><ArrowDownIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Eliminar imagen ${index + 1}`} onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}><Trash2Icon aria-hidden="true" /></Button></div></div></li>)}</ol> : <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">Sin imágenes cargadas</div>}</div>;
}

export { CoverImageManager, ProductImageManager };

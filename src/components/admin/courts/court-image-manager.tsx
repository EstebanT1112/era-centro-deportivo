"use client";

import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, ImagePlusIcon, StarIcon, Trash2Icon } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { COURT_IMAGE_OPTIONS } from "@/lib/admin-courts";

interface CourtImageManagerProps {
  images: string[];
  courtName: string;
  onChange: (images: string[]) => void;
}

function CourtImageManager({ images, courtName, onChange }: CourtImageManagerProps) {
  const nextImage = COURT_IMAGE_OPTIONS.find((image) => !images.includes(image));

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-pretty text-muted-foreground">La primera imagen se utiliza como principal. Los controles simulan la gestión de una galería local.</p>
        <Button type="button" variant="outline" size="sm" disabled={!nextImage} onClick={() => nextImage && onChange([...images, nextImage])}>
          <ImagePlusIcon data-icon="inline-start" aria-hidden="true" />
          {nextImage ? "Agregar imagen de muestra" : "Galería completa"}
        </Button>
      </div>

      {images.length ? (
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Imágenes de la cancha en orden de aparición">
          {images.map((src, index) => (
            <li key={`${src}-${index}`} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-[16/10] bg-muted">
                <Image src={src} alt={`Imagen ${index + 1} de ${courtName || "la nueva cancha"}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                {index === 0 ? <StatusBadge variant="info" icon={StarIcon} className="absolute top-2 left-2">Principal</StatusBadge> : null}
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="text-xs font-medium tabular-nums text-muted-foreground">Posición {index + 1}</span>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia arriba`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUpIcon aria-hidden="true" /></Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover imagen ${index + 1} hacia abajo`} disabled={index === images.length - 1} onClick={() => move(index, 1)}><ArrowDownIcon aria-hidden="true" /></Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Eliminar imagen ${index + 1}`} onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}><Trash2Icon aria-hidden="true" /></Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-8 text-center">
          <p className="font-medium">Sin imágenes cargadas</p>
          <p className="mt-1 text-sm text-muted-foreground">Agregá una imagen de muestra para revisar la galería.</p>
        </div>
      )}
    </div>
  );
}

export { CourtImageManager };

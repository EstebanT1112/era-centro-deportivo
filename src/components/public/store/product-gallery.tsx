"use client"

import { useState } from "react"
import Image from "next/image"

import { HOME_IMAGES } from "@/constants/assets"
import { cn } from "@/lib/utils"

function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const safeImages = images.length ? images : [HOME_IMAGES.product]
  const [selectedImage, setSelectedImage] = useState(safeImages[0])

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background-subtle"><Image src={selectedImage} alt={productName} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>
      {safeImages.length > 1 ? <div className="grid grid-cols-4 gap-2" aria-label="Imágenes del producto">{safeImages.map((image, index) => <button key={`${image}-${index}`} type="button" aria-label={`Ver imagen ${index + 1} de ${productName}`} aria-pressed={selectedImage === image} onClick={() => setSelectedImage(image)} className={cn("relative aspect-square overflow-hidden rounded-md border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/30", selectedImage === image ? "border-primary ring-1 ring-primary" : "border-border")}><Image src={image} alt="" fill sizes="8rem" className="object-cover" /></button>)}</div> : null}
    </div>
  )
}

export { ProductGallery }

import Image from "next/image"

import { HOME_IMAGES } from "@/constants/assets"
import { cn } from "@/lib/utils"

interface DisciplineGalleryProps {
  disciplineName: string
  images: string[]
}

function DisciplineGallery({ disciplineName, images }: DisciplineGalleryProps) {
  const galleryImages = images.length ? images.slice(0, 5) : [HOME_IMAGES.community]

  return (
    <div className="grid auto-rows-44 gap-3 sm:grid-cols-2 sm:auto-rows-56 lg:grid-cols-3">
      {galleryImages.map((image, index) => (
        <figure
          key={`${image}-${index}`}
          className={cn(
            "relative overflow-hidden rounded-lg border border-border bg-muted",
            index === 0 && galleryImages.length > 1 && "sm:row-span-2 lg:col-span-2",
            galleryImages.length === 1 && "sm:col-span-2 sm:row-span-2 lg:col-span-3"
          )}
        >
          <Image
            src={image || HOME_IMAGES.community}
            alt={`${disciplineName}: imagen ${index + 1} de ${galleryImages.length}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  )
}

export { DisciplineGallery }

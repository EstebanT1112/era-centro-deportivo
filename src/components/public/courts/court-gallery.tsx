import Image from "next/image"

import { HOME_IMAGES } from "@/constants/assets"
import { cn } from "@/lib/utils"

interface CourtGalleryProps {
  images: string[]
  courtName: string
}

function CourtGallery({ images, courtName }: CourtGalleryProps) {
  const galleryImages = images.length ? images.slice(0, 3) : [HOME_IMAGES.court]
  const hasSupportingImages = galleryImages.length > 1

  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-xl border border-border bg-muted shadow-subtle",
        hasSupportingImages && "gap-1 md:grid-cols-[2fr_1fr]"
      )}
    >
      <div className="relative aspect-[16/11] min-h-64 md:aspect-auto md:min-h-[30rem]">
        <Image
          src={galleryImages[0]}
          alt={`Vista principal de ${courtName}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
      {hasSupportingImages ? (
        <div
          className={cn(
            "grid gap-1 md:grid-cols-1",
            galleryImages.length > 2 ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {galleryImages.slice(1).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-[4/3] min-h-36 overflow-hidden md:aspect-auto md:min-h-0"
            >
              <Image
                src={image}
                alt={`Vista ${index + 2} de ${courtName}`}
                fill
                sizes="(max-width: 768px) 50vw, 24vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { CourtGallery }

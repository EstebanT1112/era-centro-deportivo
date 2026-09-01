import { ExternalLinkIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface LocationMapProps {
  className?: string
  showNote?: boolean
}

function LocationMap({ className, showNote = true }: LocationMapProps) {
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.address)}&output=embed`

  return (
    <div className={cn("relative min-h-80 overflow-hidden bg-muted", className)}>
      <iframe
        src={mapEmbedUrl}
        title={`Mapa de ${siteConfig.clubName}`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
      {showNote ? (
        <div className="absolute right-4 bottom-4 left-4 rounded-md bg-surface/94 p-4 shadow-card sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm">
          <p className="type-label text-primary">Cómo llegar</p>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">{siteConfig.contact.address}</p>
          <a
            href={siteConfig.contact.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            Abrir en Google Maps
            <ExternalLinkIcon className="size-4" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </div>
  )
}

export { LocationMap }

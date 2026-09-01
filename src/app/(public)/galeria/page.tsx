import type { Metadata } from "next"

import { GalleryExplorer } from "@/components/public/gallery/gallery-explorer"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { getVisibleGalleryItems } from "@/lib/mock-selectors"

export const metadata: Metadata = { title: "Galería", description: "Recorré las canchas, instalaciones y momentos compartidos en ERA." }

export default function GalleryPage() {
  return <><section className="border-b border-border bg-background-subtle py-10 md:py-14"><PageContainer><PageHeader title="Espacio ERA en imágenes" description="Canchas, instalaciones, partidos y momentos que forman parte de nuestra comunidad." className="border-0 pb-0" /></PageContainer></section><section className="py-10 md:py-14"><PageContainer><GalleryExplorer items={getVisibleGalleryItems()} /></PageContainer></section></>
}

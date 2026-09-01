import type { Metadata } from "next"

import { NewsCatalog } from "@/components/public/news/news-catalog"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { getPublishedPosts } from "@/lib/mock-selectors"

export const metadata: Metadata = {
  title: "Noticias",
  description: "Novedades, torneos y mejoras de Espacio ERA.",
}

export default function NewsPage() {
  return (
    <>
      <section className="border-b border-border bg-background-subtle py-10 md:py-14"><PageContainer><PageHeader title="Noticias de ERA" description="Torneos, actividades, mejoras y todo lo que pasa en nuestra comunidad deportiva." className="border-0 pb-0" /></PageContainer></section>
      <section className="py-10 md:py-14"><PageContainer><NewsCatalog posts={getPublishedPosts()} /></PageContainer></section>
    </>
  )
}

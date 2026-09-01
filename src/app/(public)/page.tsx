import type { Metadata } from "next"

import { ClubIntro } from "@/components/public/home/club-intro"
import { FaqPreview } from "@/components/public/home/faq-preview"
import { FeaturedCourts } from "@/components/public/home/featured-courts"
import { FeaturedDisciplines } from "@/components/public/home/featured-disciplines"
import { FeaturedProducts } from "@/components/public/home/featured-products"
import { FinalCta } from "@/components/public/home/final-cta"
import { GalleryPreview } from "@/components/public/home/gallery-preview"
import { HomeHero } from "@/components/public/home/hero"
import { LatestNews } from "@/components/public/home/latest-news"
import { LocationSection } from "@/components/public/home/location-section"
import { ServicesSection } from "@/components/public/home/services-section"
import {
  getFeaturedCourts,
  getFeaturedFaqs,
  getFeaturedGalleryItems,
  getFeaturedProducts,
  getPublishedPosts,
} from "@/lib/mock-selectors"
import { getFeaturedDisciplines } from "@/lib/disciplines"
import { siteContent } from "@/mocks"

export const metadata: Metadata = {
  title: "Espacio ERA | Centro deportivo y canchas",
  description:
    "Conocé las canchas, instalaciones y novedades de Espacio ERA en Villa Elisa. Reservá tu turno de forma simple.",
}

export default function HomePage() {
  const featuredCourts = getFeaturedCourts().slice(0, 3)
  const featuredDisciplines = getFeaturedDisciplines().slice(0, 4)
  const latestPosts = getPublishedPosts().slice(0, 3)
  const featuredProducts = getFeaturedProducts().slice(0, 3)
  const featuredGallery = getFeaturedGalleryItems().slice(0, 7)
  const featuredFaqs = getFeaturedFaqs().slice(0, 5)

  return (
    <>
      <HomeHero content={siteContent.home} />
      <ClubIntro content={siteContent.club} />
      <FeaturedDisciplines disciplines={featuredDisciplines} />
      <FeaturedCourts courts={featuredCourts} />
      <ServicesSection />
      <LatestNews posts={latestPosts} />
      <FeaturedProducts products={featuredProducts} />
      <GalleryPreview items={featuredGallery} />
      <FaqPreview faqs={featuredFaqs} />
      <LocationSection />
      <FinalCta />
    </>
  )
}

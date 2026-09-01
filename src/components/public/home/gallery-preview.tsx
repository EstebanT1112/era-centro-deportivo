import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/types"
import { HomeReveal } from "./home-reveal"

const galleryLayout = [
  "col-span-2 row-span-2 md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "col-span-2 md:col-span-12",
]

function GalleryPreview({ items }: { items: GalleryItem[] }) {
  if (!items.length) {
    return null
  }

  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <PageContainer className="flex flex-col gap-10">
        <HomeReveal>
          <SectionHeader
            eyebrow="Galería"
            title="Así se vive ERA"
            description="Canchas, instalaciones y momentos que construyen la comunidad de ERA."
            action={
              <Link href="/galeria" className={buttonVariants({ variant: "outline" })}>
                Ver galería completa
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            }
          />
        </HomeReveal>
        <HomeReveal delay={0.06} distance={18}>
          <div className="grid auto-rows-[13rem] grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[11rem] lg:auto-rows-[13rem]">
            {items.slice(0, 7).map((item, index) => (
              <figure
                key={item.id}
                className={cn(
                  "group relative overflow-hidden rounded-lg bg-muted",
                  galleryLayout[index]
                )}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? "Momento destacado de Espacio ERA"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 40vw, 33vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {item.title ? (
                  <figcaption className="absolute right-3 bottom-3 left-3 rounded-md bg-primary-active/92 px-3 py-2 text-sm font-semibold text-primary-foreground">
                    {item.title}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { GalleryPreview }

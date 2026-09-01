import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, UsersRoundIcon } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"
import type { ClubContent } from "@/types"
import { HomeReveal } from "./home-reveal"

function ClubIntro({ content }: { content: ClubContent }) {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <PageContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <HomeReveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <Image
              src={content.images[0]}
              alt="Deportistas y profesores compartiendo un momento en Espacio ERA"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-md bg-primary-active px-4 py-3 text-primary-foreground shadow-card sm:bottom-6 sm:left-6">
              <UsersRoundIcon className="size-5 text-accent" aria-hidden="true" />
              <span className="text-sm font-semibold">Deporte y comunidad, todos los días</span>
            </div>
          </div>
        </HomeReveal>
        <HomeReveal className="flex flex-col items-start gap-6" delay={0.08}>
          <div className="flex flex-col gap-3 border-l-4 border-accent pl-5">
            <p className="type-label text-primary">Mucho más que una cancha</p>
            <h2 className="type-h2 text-foreground">{content.introTitle}</h2>
          </div>
          <p className="type-body-lg max-w-xl text-muted-foreground">
            {content.introText}
          </p>
          <Link
            href="/club"
            className={buttonVariants({ variant: "outline" })}
          >
            Conocer el centro
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { ClubIntro }

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, CalendarCheck2Icon, MapPinIcon } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"
import type { HomeContent } from "@/types"
import { HomeReveal } from "./home-reveal"

function HomeHero({ content }: { content: HomeContent }) {
  return (
    <section className="overflow-hidden border-b border-border bg-background-subtle">
      <PageContainer size="hero" className="grid min-h-[calc(100dvh-4rem)] items-center gap-8 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-0 lg:py-0 xl:min-h-[calc(100dvh-4.5rem)]">
        <HomeReveal className="relative z-10 flex max-w-2xl flex-col items-start gap-6 lg:py-20 lg:pr-12" distance={18}>
          <div className="flex items-center gap-2 border-l-4 border-accent pl-3 text-sm font-semibold text-primary">
            <MapPinIcon className="size-4" aria-hidden="true" />
            Tu lugar para jugar en Villa Elisa
          </div>
          <div className="flex flex-col gap-4">
            <p className="type-label text-primary">Espacio ERA · Centro deportivo</p>
            <h1 className="type-display max-w-xl text-foreground">
              {content.heroTitle}
            </h1>
            <p className="type-body-lg max-w-xl text-muted-foreground">
              {content.heroDescription}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/reservas"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <CalendarCheck2Icon data-icon="inline-start" />
              Reservar cancha
            </Link>
            <Link
              href="/canchas"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Ver canchas
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
          <p className="text-sm text-pretty text-muted-foreground">
            Turnos de 60 y 90 minutos · Abierto de lunes a domingo
          </p>
        </HomeReveal>

        <HomeReveal delay={0.12} distance={28}>
          <div className="relative min-h-[26rem] overflow-hidden rounded-lg border border-border bg-primary shadow-card lg:min-h-[42rem] lg:rounded-none lg:border-y-0 lg:border-r-0 lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]">
            <Image
              src={content.heroImage}
              alt="Cancha de fútbol de Espacio ERA iluminada al atardecer"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 rounded-md bg-surface/94 p-4 shadow-floating sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-xs">
              <div>
                <p className="type-caption text-muted-foreground">Próximo paso</p>
                <p className="font-display text-h4 text-foreground">Elegí cancha, día y horario</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <ArrowRightIcon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </div>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { HomeHero }

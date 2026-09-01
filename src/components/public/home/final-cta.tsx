import Link from "next/link"
import { CalendarCheck2Icon } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"
import { HomeReveal } from "./home-reveal"

function FinalCta() {
  return (
    <section className="bg-accent py-12 md:py-14">
      <PageContainer>
        <HomeReveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center" distance={14}>
          <div className="flex max-w-2xl flex-col gap-1">
            <p className="type-label text-accent-foreground/72">Tu próximo partido empieza acá</p>
            <h2 className="type-h2 text-accent-foreground">¿Listo para jugar?</h2>
          </div>
          <Link
            href="/reservas"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            <CalendarCheck2Icon data-icon="inline-start" />
            Reservar cancha
          </Link>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { FinalCta }

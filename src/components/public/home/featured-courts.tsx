import Link from "next/link"
import { ArrowRightIcon, GoalIcon } from "lucide-react"

import { CourtCard } from "@/components/public/cards/court-card"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import type { Court } from "@/types"
import { HomeReveal, HomeRevealGroup } from "./home-reveal"

function FeaturedCourts({ courts }: { courts: Court[] }) {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <PageContainer className="flex flex-col gap-10">
        <HomeReveal>
          <SectionHeader
            eyebrow="Canchas destacadas"
            title="Elegí dónde empieza el partido"
            description="Espacios preparados para distintos equipos, ritmos y horarios. Consultá el estado antes de reservar."
            action={
              <Link href="/canchas" className={buttonVariants({ variant: "outline" })}>
                Ver todas
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            }
          />
        </HomeReveal>
        {courts.length ? (
          <HomeRevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.09}>
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} variant="featured" />
            ))}
          </HomeRevealGroup>
        ) : (
          <EmptyState
            icon={GoalIcon}
            title="No hay canchas destacadas"
            description="Podés consultar el listado completo y revisar las opciones disponibles."
            action={
              <Link href="/canchas" className={buttonVariants({ variant: "primary" })}>
                Ver canchas
              </Link>
            }
          />
        )}
      </PageContainer>
    </section>
  )
}

export { FeaturedCourts }

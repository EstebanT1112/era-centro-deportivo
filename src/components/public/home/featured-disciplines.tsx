import Link from "next/link"
import { ArrowRightIcon, DumbbellIcon } from "lucide-react"

import { DisciplineCard } from "@/components/public/disciplines/discipline-card"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import type { Discipline } from "@/types"
import { HomeReveal, HomeRevealGroup } from "./home-reveal"

function FeaturedDisciplines({ disciplines }: { disciplines: Discipline[] }) {
  return (
    <section className="border-y border-border bg-background-subtle py-16 md:py-20 lg:py-24">
      <PageContainer className="flex flex-col gap-10">
        <HomeReveal>
          <SectionHeader
            eyebrow="Disciplinas"
            title="Una actividad para cada forma de moverse"
            description="Formación, recreación y competencia con categorías para distintas edades y profesores del centro."
            action={
              <Link href="/disciplinas" className={buttonVariants({ variant: "outline" })}>
                Ver todas las disciplinas
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            }
          />
        </HomeReveal>
        {disciplines.length ? (
          <HomeRevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {disciplines.map((discipline) => (
              <DisciplineCard key={discipline.id} discipline={discipline} variant="featured" />
            ))}
          </HomeRevealGroup>
        ) : (
          <EmptyState
            icon={DumbbellIcon}
            title="Próximamente, nuevas disciplinas"
            description="Estamos preparando la información de las actividades del centro deportivo."
            action={
              <Link href="/disciplinas" className={buttonVariants({ variant: "outline" })}>
                Consultar actividades
              </Link>
            }
          />
        )}
      </PageContainer>
    </section>
  )
}

export { FeaturedDisciplines }

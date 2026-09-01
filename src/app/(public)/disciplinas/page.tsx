import type { Metadata } from "next"
import { ArrowRightIcon, DumbbellIcon, MessageCircleIcon } from "lucide-react"

import { DisciplineCard } from "@/components/public/disciplines/discipline-card"
import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getVisibleDisciplines } from "@/lib/disciplines"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Disciplinas",
  description: "Actividades deportivas, categorías, horarios y profesores de Espacio ERA.",
}

export default function DisciplinesPage() {
  const disciplines = getVisibleDisciplines()

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-10 md:py-14">
        <PageContainer>
          <PageHeader
            title="Disciplinas"
            description="Encontrá una actividad para cada etapa, conocé sus categorías y hablá directamente con el equipo que la coordina."
            className="border-0 pb-0"
          />
        </PageContainer>
      </section>

      <section className="bg-background py-12 md:py-16 lg:py-20" aria-labelledby="disciplines-list-heading">
        <PageContainer className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3 border-l-4 border-accent pl-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="type-label text-primary">Deporte y comunidad</p>
              <h2 id="disciplines-list-heading" className="mt-2 type-h2 text-foreground">
                Elegí cómo vivir el deporte
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground">
                Propuestas formativas, recreativas y competitivas para distintas edades y experiencias.
              </p>
            </div>
            {disciplines.length ? (
              <p className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                {disciplines.length} disciplinas disponibles
              </p>
            ) : null}
          </div>

          {disciplines.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {disciplines.map((discipline) => (
                <DisciplineCard key={discipline.id} discipline={discipline} eager />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={DumbbellIcon}
              title="Todavía no hay disciplinas publicadas"
              description="Consultanos para conocer las actividades que se están organizando en el centro deportivo."
              titleAs="h2"
              action={
                <a
                  href={siteConfig.contact.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "whatsapp" })}
                >
                  <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
                  Consultar al centro
                </a>
              }
            />
          )}
        </PageContainer>
      </section>

      <section className="bg-surface pb-16 md:pb-20 lg:pb-24">
        <PageContainer>
          <div className="flex flex-col gap-6 rounded-xl border border-border bg-background-subtle p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-h3 text-balance text-foreground">¿No sabés qué actividad elegir?</h2>
              <p className="mt-2 text-pretty text-muted-foreground">
                Contanos qué estás buscando y te orientamos según edades, horarios y experiencia previa.
              </p>
            </div>
            <a
              href={siteConfig.contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
            >
              Consultar al centro
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </a>
          </div>
        </PageContainer>
      </section>
    </>
  )
}

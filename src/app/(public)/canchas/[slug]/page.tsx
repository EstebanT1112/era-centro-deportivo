import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock3Icon, Layers3Icon, TagIcon } from "lucide-react"

import { CourtBookingPanel } from "@/components/public/courts/court-booking-panel"
import { CourtGallery } from "@/components/public/courts/court-gallery"
import { CourtServices } from "@/components/public/courts/court-services"
import { CourtStatusBadge } from "@/components/public/courts/court-status-badge"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COURT_TYPES } from "@/constants/domain"
import { formatCurrency } from "@/lib/formatters"
import { getCourtBySlug, getPublicCourts } from "@/lib/mock-selectors"
import { getMockCourtAvailability, MOCK_BOOKING_DATES } from "@/mocks/court-availability"

export function generateStaticParams() {
  return getPublicCourts().map((court) => ({ slug: court.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const court = getCourtBySlug(slug)

  if (!court) return { title: "Cancha no encontrada" }

  return {
    title: court.name,
    description: `${court.name}: ${court.surface}, turnos de ${court.slotMinutes} minutos y servicios del centro deportivo.`,
  }
}

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const court = getCourtBySlug(slug);

  if (!court) {
    notFound()
  }

  const type = COURT_TYPES.find((item) => item.value === court.type)?.label
  const availability = getMockCourtAvailability(court)

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-8 md:py-12">
        <PageContainer>
          <PageHeader
            title={court.name}
            description={`${type} con ${court.surface.toLowerCase()}, preparada para turnos de ${court.slotMinutes} minutos.`}
            breadcrumbs={
              <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-2">
                <Link href="/canchas" className="hover:text-primary focus-visible:text-primary">
                  Canchas
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{court.name}</span>
              </nav>
            }
            actions={<CourtStatusBadge status={court.status} />}
            className="border-0 pb-0"
          />
        </PageContainer>
      </section>

      <PageContainer className="py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)] lg:items-start">
          <CourtGallery images={court.images} courtName={court.name} />
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <div>
                <p className="type-caption mb-1 font-semibold uppercase tracking-[0.12em] text-primary">
                  Información del turno
                </p>
                <CardTitle>
                  <h2 className="font-display text-h3">Datos de la cancha</h2>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <dl className="grid gap-4">
                <div className="flex gap-3">
                  <Layers3Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Formato y superficie</dt>
                    <dd className="font-semibold text-foreground">{type} · {court.surface}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock3Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Duración</dt>
                    <dd className="font-semibold text-foreground">{court.slotMinutes} minutos</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TagIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Precio por turno</dt>
                    <dd className="text-lg font-bold tabular-nums text-foreground">
                      {formatCurrency(court.pricePerSlot)}
                    </dd>
                  </div>
                </div>
              </dl>
              <p className="border-t border-border pt-4 text-sm text-muted-foreground">
                El importe y la disponibilidad son datos simulados para evaluar el prototipo visual.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <section className="border-y border-border bg-surface py-10 md:py-14" aria-label="Servicios de la cancha">
        <PageContainer>
          <SectionHeader
            title="Servicios incluidos"
            description="Todo lo necesario para que el equipo llegue, juegue y disfrute el turno con comodidad."
            eyebrow="Instalaciones"
            className="mb-8"
          />
          <CourtServices services={court.services} />
        </PageContainer>
      </section>

      <section className="py-10 md:py-16" aria-label="Disponibilidad de la cancha">
        <PageContainer>
          <CourtBookingPanel
            court={court}
            availability={availability}
            dates={[...MOCK_BOOKING_DATES]}
          />
        </PageContainer>
      </section>
    </>
  )
}

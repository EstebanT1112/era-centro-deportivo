import type { Metadata } from "next"

import { CourtCatalog } from "@/components/public/courts/court-catalog"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { getPublicCourts } from "@/lib/mock-selectors"

export const metadata: Metadata = {
  title: "Canchas",
  description: "Conocé las canchas de Espacio ERA y encontrá el lugar ideal para tu próximo partido.",
}

export default function CourtsPage() {
  const courts = getPublicCourts()

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-10 md:py-14">
        <PageContainer>
          <PageHeader
            title="Canchas para jugar a tu manera"
            description="Compará formatos, superficies y servicios. Cuando encuentres la indicada, revisá sus horarios disponibles."
            className="border-0 pb-0"
          />
        </PageContainer>
      </section>
      <section className="py-10 md:py-14" aria-label="Listado de canchas">
        <PageContainer>
          <CourtCatalog courts={courts} />
        </PageContainer>
      </section>
    </>
  )
}

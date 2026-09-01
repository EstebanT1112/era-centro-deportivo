import type { Metadata } from "next"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ReservationWizard } from "@/features/reservations/components/reservation-wizard"
import {
  EMPTY_RESERVATION_DRAFT,
  type ReservationDraft,
} from "@/features/reservations/types"
import { getPublicCourts } from "@/lib/mock-selectors"
import { getMockCourtAvailability, MOCK_BOOKING_DATES } from "@/mocks/court-availability"

export const metadata: Metadata = {
  title: "Reservar cancha",
  description: "Elegí cancha, fecha y horario y completá una reserva simulada en Espacio ERA.",
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const courtSlug = firstParam(query.court)
  const requestedDate = firstParam(query.date)
  const requestedTime = firstParam(query.time)
  const courts = getPublicCourts()
  const court = courts.find((item) => item.slug === courtSlug && item.status === "active")

  const initialDraft: ReservationDraft = { ...EMPTY_RESERVATION_DRAFT }

  if (court) {
    initialDraft.courtId = court.id
    if (requestedDate && MOCK_BOOKING_DATES.includes(requestedDate as (typeof MOCK_BOOKING_DATES)[number])) {
      initialDraft.date = requestedDate
      const slot = getMockCourtAvailability(court)[requestedDate]?.find(
        (item) => item.startTime === requestedTime && item.status === "available"
      )
      if (slot) initialDraft.time = slot.startTime
    }
  }

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-9 md:py-12">
        <PageContainer>
          <PageHeader
            title="Reservá tu cancha"
            description="Elegí el turno, completá tus datos y simulá el pago de la seña con claridad en cada paso."
            className="border-0 pb-0"
          />
        </PageContainer>
      </section>
      <section className="py-8 md:py-12" aria-label="Flujo de reserva">
        <PageContainer>
          <ReservationWizard courts={courts} initialDraft={initialDraft} />
        </PageContainer>
      </section>
    </>
  )
}

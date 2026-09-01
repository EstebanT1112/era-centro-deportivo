import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { NewReservationForm } from "@/components/admin/reservations/new-reservation-form"
import { MOCK_CURRENT_DATE } from "@/constants/prototype"
import { getValidCourtFromQuery } from "@/lib/admin-reservations"
import { courts } from "@/mocks"

export const metadata: Metadata = { title: "Nueva reserva" }

export default async function NewAdminReservationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const queryCourt = typeof query.court === "string" ? query.court : undefined
  const court = getValidCourtFromQuery(queryCourt) ?? courts.find((item) => item.status === "active")!
  const date = typeof query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(query.date) ? query.date : MOCK_CURRENT_DATE
  const time = typeof query.time === "string" && /^\d{2}:\d{2}$/.test(query.time) ? query.time : ""

  return <div className="flex flex-col gap-6">
    <AdminPageHeader title="Nueva reserva" description="Registrá manualmente un turno en una única pantalla operativa." breadcrumbs={[{ label: "Reservas", href: "/admin/reservas" }, { label: "Nueva reserva" }]} />
    <NewReservationForm initialValues={{ courtId: court.id, date, time }} />
  </div>
}

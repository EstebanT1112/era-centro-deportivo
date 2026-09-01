import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RecurringReservations } from "@/components/admin/reservations/recurring-reservations"

export const metadata: Metadata = { title: "Reservas recurrentes" }

export default function RecurringReservationsPage() {
  return <div className="flex flex-col gap-6"><AdminPageHeader title="Reservas recurrentes" description="Administrá series semanales sin generar reservas futuras reales." breadcrumbs={[{ label: "Reservas", href: "/admin/reservas" }, { label: "Recurrentes" }]} /><RecurringReservations /></div>
}

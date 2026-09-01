import type { Metadata } from "next"
import Link from "next/link"
import { CalendarPlusIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ReservationCalendar } from "@/components/admin/reservations/reservation-calendar"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Calendario de reservas" }

export default function AdminReservationCalendarPage() {
  return <div className="flex flex-col gap-6">
    <AdminPageHeader title="Calendario de reservas" description="Visualizá la ocupación de canchas por fecha y horario." breadcrumbs={[{ label: "Reservas", href: "/admin/reservas" }, { label: "Calendario" }]} actions={<Button render={<Link href="/admin/reservas/nueva" />} nativeButton={false}><CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />Nueva reserva</Button>} />
    <ReservationCalendar />
  </div>
}

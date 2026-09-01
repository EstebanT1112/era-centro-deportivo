import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDaysIcon, CalendarPlusIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ReservationsList } from "@/components/admin/reservations/reservations-list"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Reservas" }

export default function AdminReservationsPage() {
  return <div className="flex flex-col gap-6">
    <AdminPageHeader title="Reservas" description="Buscá, filtrá y gestioná los turnos del club desde una vista operativa." actions={<>
      <Button variant="outline" render={<Link href="/admin/reservas/calendario" />} nativeButton={false}><CalendarDaysIcon data-icon="inline-start" aria-hidden="true" />Calendario</Button>
      <Button render={<Link href="/admin/reservas/nueva" />} nativeButton={false}><CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />Nueva reserva</Button>
    </>} />
    <ReservationsList />
  </div>
}

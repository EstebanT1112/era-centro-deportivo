import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { CourtAlerts } from "@/components/admin/dashboard/court-alerts"
import { DashboardMetrics } from "@/components/admin/dashboard/dashboard-metrics"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { ReservationList } from "@/components/admin/dashboard/reservation-list"
import { MOCK_CURRENT_DATE } from "@/constants/prototype"
import { getDashboardSummary } from "@/lib/admin-dashboard"
import { formatDate } from "@/lib/formatters"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function AdminDashboardPage() {
  const summary = getDashboardSummary()

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Resumen operativo del club y prioridades del día."
        actions={<p className="text-sm font-medium capitalize text-muted-foreground"><time dateTime={MOCK_CURRENT_DATE}>{formatDate(MOCK_CURRENT_DATE)}</time></p>}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="order-1 lg:col-span-12">
          <QuickActions />
        </div>
        <div className="order-3 lg:order-2 lg:col-span-12">
          <DashboardMetrics metrics={summary.metrics} />
        </div>
        <div className="order-2 lg:order-3 lg:col-span-8">
          <ReservationList id="reservas-hoy" title="Reservas de hoy" description="Turnos ordenados por hora." reservations={summary.todayReservations} />
        </div>
        <div className="order-4 lg:order-3 lg:col-span-4">
          <CourtAlerts courts={summary.courtAlerts} />
        </div>
        <div className="order-5 lg:col-span-7">
          <ReservationList title="Próximas reservas" description="Siguientes turnos confirmados o pendientes." reservations={summary.upcomingReservations} showDate viewAllHref="/admin/reservas" />
        </div>
        <div className="order-6 lg:col-span-5">
          <ReservationList title="Recientemente confirmadas" description="Últimas reservas con estado confirmado." reservations={summary.recentlyConfirmedReservations} showDate />
        </div>
      </div>
    </>
  )
}

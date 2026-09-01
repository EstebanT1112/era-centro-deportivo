import { CalendarCheck2Icon, CalendarClockIcon, CircleAlertIcon, Clock3Icon, HandCoinsIcon, WalletCardsIcon } from "lucide-react"

import { MetricCard } from "@/components/admin/dashboard/metric-card"
import { formatCurrency } from "@/lib/formatters"

interface DashboardMetricsProps {
  metrics: {
    todayReservations: number
    upcomingReservations: number
    availableSlotsToday: number
    pendingReservations: number
    depositsCollectedToday: number
    outstandingBalance: number
  }
}

function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <section aria-labelledby="dashboard-metrics-title">
      <h2 id="dashboard-metrics-title" className="sr-only">Indicadores operativos</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Reservas de hoy" value={String(metrics.todayReservations)} icon={CalendarCheck2Icon} helper="Turnos programados" />
        <MetricCard label="Próximas reservas" value={String(metrics.upcomingReservations)} icon={CalendarClockIcon} helper="Después de hoy" />
        <MetricCard label="Turnos disponibles" value={String(metrics.availableSlotsToday)} icon={Clock3Icon} helper="En canchas activas" />
        <MetricCard label="Reservas pendientes" value={String(metrics.pendingReservations)} icon={CircleAlertIcon} helper="Requieren seguimiento" emphasis="attention" />
        <MetricCard label="Señas cobradas hoy" value={formatCurrency(metrics.depositsCollectedToday)} icon={WalletCardsIcon} helper="Pagos aprobados" emphasis="financial" />
        <MetricCard label="Saldo pendiente" value={formatCurrency(metrics.outstandingBalance)} icon={HandCoinsIcon} helper="Reservas vigentes" emphasis="financial" />
      </div>
    </section>
  )
}

export { DashboardMetrics }

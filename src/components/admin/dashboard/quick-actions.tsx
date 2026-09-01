import Link from "next/link"
import { CalendarCheck2Icon, CalendarDaysIcon, CalendarPlusIcon, LandmarkIcon, NewspaperIcon, PackagePlusIcon, SearchIcon, ShieldBanIcon, type LucideIcon } from "lucide-react"

import { MobileAdminQuickActions } from "@/components/admin/mobile-admin-quick-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type QuickAction = {
  label: string
  href: string
  icon: LucideIcon
  mobile?: boolean
  desktop?: boolean
  primary?: boolean
}

const actions: QuickAction[] = [
  { label: "Reservas de hoy", href: "#reservas-hoy", icon: CalendarCheck2Icon, mobile: true },
  { label: "Nueva reserva", href: "/admin/reservas/nueva", icon: CalendarPlusIcon, mobile: true, desktop: true, primary: true },
  { label: "Ver calendario", href: "/admin/reservas/calendario", icon: CalendarDaysIcon, mobile: true, desktop: true },
  { label: "Buscar reserva", href: "/admin/reservas", icon: SearchIcon, mobile: true },
  { label: "Registrar pago", href: "/admin/reservas", icon: LandmarkIcon, mobile: true },
  { label: "Bloquear horario", href: "/admin/canchas", icon: ShieldBanIcon, desktop: true },
  { label: "Crear noticia", href: "/admin/noticias", icon: NewspaperIcon, desktop: true },
  { label: "Agregar producto", href: "/admin/productos", icon: PackagePlusIcon, desktop: true },
]

function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title" className="flex flex-col gap-3">
      <h2 id="quick-actions-title" className="font-heading text-base font-semibold text-balance">Acciones rápidas</h2>
      <MobileAdminQuickActions>
        {actions.filter((action) => action.mobile).map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.label} variant={action.primary ? "primary" : "outline"} size="sm" className="shrink-0" render={<Link href={action.href} />} nativeButton={false}>
              <Icon data-icon="inline-start" aria-hidden="true" />
              {action.label}
            </Button>
          )
        })}
      </MobileAdminQuickActions>
      <Card className="hidden lg:flex">
        <CardHeader className="sr-only"><CardTitle>Acciones rápidas de escritorio</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-5 gap-2 p-3">
          {actions.filter((action) => action.desktop).map((action) => {
            const Icon = action.icon
            return (
              <Button key={action.label} variant={action.primary ? "primary" : "outline"} className="justify-start" render={<Link href={action.href} />} nativeButton={false}>
                <Icon data-icon="inline-start" aria-hidden="true" />
                {action.label}
              </Button>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}

export { QuickActions }

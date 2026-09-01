import type { LucideIcon } from "lucide-react"
import {
  Building2Icon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  CircleHelpIcon,
  ContactRoundIcon,
  DumbbellIcon,
  FileTextIcon,
  HistoryIcon,
  GraduationCapIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  NewspaperIcon,
  PackageIcon,
  Repeat2Icon,
  Settings2Icon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react"

interface AdminNavigationItem {
  label: string
  href: string
  icon: LucideIcon
}

interface AdminNavigationGroup {
  label: string
  icon?: LucideIcon
  items: readonly AdminNavigationItem[]
}

export const adminNavigation: readonly AdminNavigationGroup[] = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
      { label: "Canchas", href: "/admin/canchas", icon: Building2Icon },
      { label: "Disciplinas", href: "/admin/disciplinas", icon: DumbbellIcon },
      { label: "Profesores", href: "/admin/profesores", icon: GraduationCapIcon },
    ],
  },
  {
    label: "Reservas",
    icon: CalendarDaysIcon,
    items: [
      { label: "Todas las reservas", href: "/admin/reservas", icon: ListChecksIcon },
      { label: "Calendario", href: "/admin/reservas/calendario", icon: CalendarDaysIcon },
      { label: "Nueva reserva", href: "/admin/reservas/nueva", icon: CalendarPlusIcon },
      { label: "Recurrentes", href: "/admin/reservas/recurrentes", icon: Repeat2Icon },
    ],
  },
  {
    label: "Contenido",
    icon: FileTextIcon,
    items: [
      { label: "Noticias", href: "/admin/noticias", icon: NewspaperIcon },
      { label: "Productos", href: "/admin/productos", icon: PackageIcon },
      { label: "Galería", href: "/admin/galeria", icon: ImagesIcon },
      { label: "Preguntas frecuentes", href: "/admin/faqs", icon: CircleHelpIcon },
      { label: "Contenido institucional", href: "/admin/contenido", icon: FileTextIcon },
    ],
  },
  {
    label: "Administración",
    icon: ShieldCheckIcon,
    items: [
      { label: "Usuarios", href: "/admin/usuarios", icon: UsersIcon },
      { label: "Historial", href: "/admin/historial", icon: HistoryIcon },
    ],
  },
  {
    label: "Configuración",
    icon: Settings2Icon,
    items: [
      { label: "Reservas", href: "/admin/configuracion/reservas", icon: SlidersHorizontalIcon },
      { label: "Contacto y redes", href: "/admin/configuracion/contacto", icon: ContactRoundIcon },
      { label: "Datos generales", href: "/admin/configuracion/general", icon: Settings2Icon },
    ],
  },
]

export const mockAdminUser = {
  name: "Administrador",
  email: "admin@eraclub.com.ar",
  role: "Administrador",
} as const

export function getActiveAdminHref(pathname: string) {
  return adminNavigation
    .flatMap((group) => group.items)
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
}

export function getAdminPageLabel(pathname: string) {
  const activeHref = getActiveAdminHref(pathname)
  return adminNavigation.flatMap((group) => group.items).find((item) => item.href === activeHref)?.label ?? "Administración"
}

export type { AdminNavigationGroup, AdminNavigationItem }

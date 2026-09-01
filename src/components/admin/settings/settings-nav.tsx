"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const items = [
  { href: "/admin/configuracion/reservas", label: "Reservas" },
  { href: "/admin/configuracion/contacto", label: "Contacto y redes" },
  { href: "/admin/configuracion/general", label: "Datos generales" },
]

function SettingsNav() {
  const pathname = usePathname()
  return <nav aria-label="Secciones de configuración" className="overflow-x-auto border-b border-border"><ul className="flex min-w-max gap-1">{items.map((item) => { const active = pathname === item.href; return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={cn("relative flex min-h-10 items-center px-3 text-sm font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30", active && "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary")}>{item.label}</Link></li>})}</ul></nav>
}

export { SettingsNav }

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { adminNavigation, getActiveAdminHref } from "@/config/admin-navigation"
import { cn } from "@/lib/utils"

interface AdminNavigationProps {
  collapsed?: boolean
  onNavigate?: () => void
}

function AdminNavigation({ collapsed = false, onNavigate }: AdminNavigationProps) {
  const pathname = usePathname()
  const activeHref = getActiveAdminHref(pathname)

  return (
    <nav aria-label="Navegación administrativa" className="flex flex-col gap-5">
      {adminNavigation.map((group, groupIndex) => (
        <section key={group.label} aria-labelledby={collapsed ? undefined : `admin-nav-${groupIndex}`}>
          {!collapsed ? (
            <h2 id={`admin-nav-${groupIndex}`} className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60">
              {group.label}
            </h2>
          ) : null}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = activeHref === item.href
              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  className={cn(
                    "relative flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/75 outline-none transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                    collapsed && "justify-center px-2",
                    active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent"
                  )}
                >
                  <Icon aria-hidden="true" className="size-4.5 shrink-0" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              )

              return (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger render={link} />
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : link}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}

export { AdminNavigation }

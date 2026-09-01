"use client"

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"

import { AdminBrand } from "@/components/admin/admin-brand"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

function AdminSidebar({ collapsed, onCollapsedChange }: AdminSidebarProps) {
  const label = collapsed ? "Expandir barra lateral" : "Contraer barra lateral"
  const Icon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <aside id="admin-sidebar-navigation" className={cn("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex", collapsed ? "w-20" : "w-72")}>
      <div className={cn("flex min-h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        <AdminBrand compact={collapsed} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <AdminNavigation collapsed={collapsed} />
      </div>
      <Separator />
      <div className={cn("flex p-3", collapsed ? "justify-center" : "justify-end")}>
        <Tooltip>
          <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" aria-label={label} aria-controls="admin-sidebar-navigation" aria-expanded={!collapsed} onClick={() => onCollapsedChange(!collapsed)} />}>
            <Icon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}

export { AdminSidebar }

"use client"

import { MenuIcon } from "lucide-react"

import { AdminUserMenu } from "@/components/admin/admin-user-menu"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  pageLabel: string
  navigationOpen: boolean
  onOpenNavigation: () => void
}

function AdminHeader({ pageLabel, navigationOpen, onOpenNavigation }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button type="button" variant="outline" size="icon" className="lg:hidden" aria-label="Abrir navegación administrativa" aria-haspopup="dialog" aria-expanded={navigationOpen} onClick={onOpenNavigation}>
          <MenuIcon aria-hidden="true" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{pageLabel}</p>
          <p className="hidden text-xs text-muted-foreground sm:block">Panel de administración</p>
        </div>
      </div>
      <AdminUserMenu />
    </header>
  )
}

export { AdminHeader }

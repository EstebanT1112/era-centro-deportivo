"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminMobileNavigation } from "@/components/admin/admin-mobile-navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getAdminPageLabel } from "@/config/admin-navigation"

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TooltipProvider>
      <a href="#admin-content" className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground outline-none focus:translate-y-0 focus:ring-2 focus:ring-ring/40">
        Saltar al contenido
      </a>
      <div className="flex min-h-dvh bg-background">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader pageLabel={getAdminPageLabel(pathname)} navigationOpen={mobileOpen} onOpenNavigation={() => setMobileOpen(true)} />
          <main id="admin-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-5 outline-none sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
      <AdminMobileNavigation open={mobileOpen} onOpenChange={setMobileOpen} />
    </TooltipProvider>
  )
}

export { AdminShell }

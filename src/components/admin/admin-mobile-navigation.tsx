"use client"

import { AdminBrand } from "@/components/admin/admin-brand"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface AdminMobileNavigationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AdminMobileNavigation({ open, onOpenChange }: AdminMobileNavigationProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="gap-0 p-0">
        <SheetHeader className="border-b border-border pr-14">
          <AdminBrand />
          <SheetTitle className="sr-only">Navegación administrativa</SheetTitle>
          <SheetDescription className="sr-only">Accesos a las secciones del panel de administración.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <AdminNavigation onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { AdminMobileNavigation }

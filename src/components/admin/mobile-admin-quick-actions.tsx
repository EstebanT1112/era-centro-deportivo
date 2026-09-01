import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface MobileAdminQuickActionsProps {
  children: ReactNode
  className?: string
}

function MobileAdminQuickActions({ children, className }: MobileAdminQuickActionsProps) {
  return (
    <nav aria-label="Acciones rápidas" className={cn("flex gap-2 overflow-x-auto pb-1 lg:hidden", className)}>
      {children}
    </nav>
  )
}

export { MobileAdminQuickActions }

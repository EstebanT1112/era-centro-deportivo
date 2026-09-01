import type { ComponentType, SVGProps } from "react"
import { WrenchIcon } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import type { StatusBadgeVariant } from "@/components/shared/status-badge"
import type { CourtStatus } from "@/types"

const statusPresentation: Record<
  CourtStatus,
  {
    label: string
    variant: StatusBadgeVariant
    icon?: ComponentType<SVGProps<SVGSVGElement>>
  }
> = {
  active: { label: "Disponible", variant: "success" },
  inactive: { label: "No disponible", variant: "neutral" },
  maintenance: { label: "En mantenimiento", variant: "warning", icon: WrenchIcon },
}

interface CourtStatusBadgeProps {
  status: CourtStatus
}

function CourtStatusBadge({ status }: CourtStatusBadgeProps) {
  const presentation = statusPresentation[status]

  return (
    <StatusBadge
      variant={presentation.variant}
      icon={presentation.icon}
      blocked={status === "inactive"}
    >
      {presentation.label}
    </StatusBadge>
  )
}

export { CourtStatusBadge }

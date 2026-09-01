import type { ComponentType, SVGProps } from "react"
import { BanIcon, CheckCircle2Icon, CircleIcon, Clock3Icon, InfoIcon, XCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

type StatusBadgeVariant = "success" | "warning" | "danger" | "info" | "neutral"
type StatusIcon = ComponentType<SVGProps<SVGSVGElement>>

const statusIcons: Record<StatusBadgeVariant, StatusIcon> = {
  success: CheckCircle2Icon,
  warning: Clock3Icon,
  danger: XCircleIcon,
  info: InfoIcon,
  neutral: CircleIcon,
}

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: StatusBadgeVariant
  icon?: StatusIcon
  blocked?: boolean
  className?: string
}

function StatusBadge({
  children,
  variant = "neutral",
  icon,
  blocked = false,
  className,
}: StatusBadgeProps) {
  const Icon = blocked ? BanIcon : (icon ?? statusIcons[variant])

  return (
    <Badge variant={variant} className={className}>
      <Icon data-icon="inline-start" aria-hidden="true" />
      {children}
    </Badge>
  )
}

export { StatusBadge }
export type { StatusBadgeProps, StatusBadgeVariant }

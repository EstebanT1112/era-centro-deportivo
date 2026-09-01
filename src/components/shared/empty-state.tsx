import type { ComponentType, ReactNode, SVGProps } from "react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type EmptyStateIcon = ComponentType<SVGProps<SVGSVGElement>>

interface EmptyStateProps {
  icon: EmptyStateIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
  titleAs?: "h1" | "h2" | "h3"
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  titleAs,
}: EmptyStateProps) {
  const Title = titleAs

  return (
    <Empty className={cn("border border-border bg-surface", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>
        {Title ? (
          <Title className="font-heading text-base font-semibold text-balance">
            {title}
          </Title>
        ) : (
          <EmptyTitle>{title}</EmptyTitle>
        )}
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}

export { EmptyState }
export type { EmptyStateProps }

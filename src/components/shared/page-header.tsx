import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: ReactNode
  actions?: ReactNode
  className?: string
}

function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 max-w-3xl flex-col gap-2">
        {breadcrumbs ? (
          <div className="type-caption text-muted-foreground">{breadcrumbs}</div>
        ) : null}
        <h1 className="type-h1 text-foreground">{title}</h1>
        {description ? (
          <p className="type-body max-w-2xl text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

export { PageHeader }
export type { PageHeaderProps }

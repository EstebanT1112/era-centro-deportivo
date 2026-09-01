import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
  align?: "start" | "center"
}

function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  className,
  align = "start",
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      data-align={align}
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" &&
          "items-center text-center sm:flex-col sm:items-center sm:justify-start",
        className
      )}
    >
      <div className="flex max-w-3xl flex-col gap-2">
        {eyebrow ? (
          <p className="type-label text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="type-h2 text-foreground">{title}</h2>
        {description ? (
          <p className="type-body-lg max-w-2xl text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export { SectionHeader }
export type { SectionHeaderProps }

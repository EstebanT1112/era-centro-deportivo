import type { ComponentType, SVGProps } from "react"

import { cn } from "@/lib/utils"

type ServiceIcon = ComponentType<SVGProps<SVGSVGElement>>

interface ServiceItemProps {
  icon: ServiceIcon
  title: string
  description: string
  variant?: "inverse" | "surface"
}

function ServiceItem({
  icon: Icon,
  title,
  description,
  variant = "inverse",
}: ServiceItemProps) {
  return (
    <article
      className={cn(
        "flex gap-4 border-t pt-5",
        variant === "inverse"
          ? "border-primary-foreground/18"
          : "border-border"
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-md",
          variant === "inverse"
            ? "bg-accent text-accent-foreground"
            : "bg-secondary text-primary"
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            "font-display text-h4",
            variant === "inverse" ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm text-pretty",
            variant === "inverse"
              ? "text-primary-foreground/72"
              : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      </div>
    </article>
  )
}

export { ServiceItem }
export type { ServiceItemProps }

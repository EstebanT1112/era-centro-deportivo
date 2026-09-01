import type { LucideIcon } from "lucide-react"

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  helper?: string
  emphasis?: "default" | "attention" | "financial"
}

function MetricCard({ label, value, icon: Icon, helper, emphasis = "default" }: MetricCardProps) {
  return (
    <Card size="sm" className={cn(emphasis === "attention" && "border-warning/35", emphasis === "financial" && "bg-background-subtle")}>
      <CardHeader>
        <CardTitle className="pr-10 text-sm text-muted-foreground">{label}</CardTitle>
        <CardAction>
          <span className={cn("flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground", emphasis === "attention" && "bg-warning/10 text-warning", emphasis === "financial" && "bg-primary/10 text-primary")}>
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        {helper ? <p className="text-xs text-pretty text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  )
}

export { MetricCard }

import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

interface AdminFilterBarProps {
  search?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
  resultCount?: ReactNode
  clearAction?: ReactNode
}

function AdminFilterBar({ search, filters, actions, resultCount, clearAction }: AdminFilterBarProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
        {search ? <div className="min-w-0 flex-1 lg:max-w-sm">{search}</div> : null}
        {filters ? <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{filters}</div> : null}
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          {resultCount ? <div className="mr-auto text-sm tabular-nums text-muted-foreground lg:mr-0">{resultCount}</div> : null}
          {clearAction}
          {actions}
        </div>
      </CardContent>
    </Card>
  )
}

export { AdminFilterBar }

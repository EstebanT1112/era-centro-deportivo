import type { ReactNode } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function FormSection({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="gap-1 border-b border-border p-4 sm:p-5">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-4 sm:p-5">{children}</CardContent>
    </Card>
  )
}

function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-5 md:grid-cols-2", className)}>{children}</div>
}

function FormActions({ children, destructive }: { children: ReactNode; destructive?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>{destructive}</div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">{children}</div>
      </div>
    </div>
  )
}

export { FormActions, FormGrid, FormSection }

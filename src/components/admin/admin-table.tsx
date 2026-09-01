"use client"

import type { ReactNode } from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdminTableShellProps {
  title: string
  description?: string
  children: ReactNode
  mobileFallback?: ReactNode
}

function AdminTableShell({ title, description, children, mobileFallback }: AdminTableShellProps) {
  return (
    <Card>
      <CardHeader className="gap-1 border-b border-border p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-0">
        {mobileFallback ? <div className="md:hidden">{mobileFallback}</div> : null}
        <div className={mobileFallback ? "hidden md:block" : undefined}>{children}</div>
      </CardContent>
    </Card>
  )
}

function AdminRowActions({ label = "Abrir acciones de fila", children }: { label?: string; children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AdminRowActions, AdminTableShell }

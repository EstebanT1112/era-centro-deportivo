import { Fragment, type ReactNode } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

interface AdminBreadcrumbItem {
  label: string
  href?: string
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: readonly AdminBreadcrumbItem[]
  actions?: ReactNode
  className?: string
}

function AdminPageHeader({ title, description, breadcrumbs, actions, className }: AdminPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex min-w-0 max-w-3xl flex-col gap-2">
        {breadcrumbs?.length ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <Fragment key={`${item.label}-${index}`}>
                  {index ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {item.href ? <BreadcrumbLink render={<Link href={item.href} />}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
        <h1 className="font-heading text-2xl font-semibold text-balance text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div> : null}
    </header>
  )
}

export { AdminPageHeader }
export type { AdminBreadcrumbItem, AdminPageHeaderProps }

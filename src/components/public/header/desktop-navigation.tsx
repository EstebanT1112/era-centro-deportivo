"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { publicNavigation } from "@/constants/navigation"
import { isNavigationItemActive } from "@/lib/navigation"
import { cn } from "@/lib/utils"

function DesktopNavigation() {
  const pathname = usePathname()
  const reservationItem = publicNavigation.find((item) => item.isPrimary)
  const navigationItems = publicNavigation.filter((item) => !item.isPrimary)

  return (
    <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 xl:flex">
      <nav aria-label="Navegación principal">
        <ul className="flex items-center gap-0.5">
          {navigationItems.map((item) => {
            const active = isNavigationItemActive(pathname, item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-10 items-center rounded-sm px-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
                    active &&
                      "font-semibold text-primary after:scale-x-100"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {reservationItem ? (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Link
            href={reservationItem.href}
            aria-current={
              isNavigationItemActive(pathname, reservationItem.href)
                ? "page"
                : undefined
            }
            className={buttonVariants({ variant: "primary" })}
          >
            {reservationItem.label}
          </Link>
        </>
      ) : null}
    </div>
  )
}

export { DesktopNavigation }

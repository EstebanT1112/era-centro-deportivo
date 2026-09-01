"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { ClubBrand } from "@/components/public/club-brand"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { publicNavigation } from "@/constants/navigation"
import { isNavigationItemActive } from "@/lib/navigation"
import { cn } from "@/lib/utils"

function MobileNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const reservationItem = publicNavigation.find((item) => item.isPrimary)
  const navigationItems = publicNavigation.filter((item) => !item.isPrimary)

  return (
    <div className="xl:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Abrir menú principal"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="gap-0">
          <SheetHeader className="pr-14">
            <ClubBrand />
            <SheetTitle className="sr-only">Navegación principal</SheetTitle>
            <SheetDescription className="sr-only">
              Accesos a las secciones públicas de Espacio ERA.
            </SheetDescription>
          </SheetHeader>
          <Separator />

          <nav
            aria-label="Navegación principal mobile"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4"
          >
            <ul className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const active = isNavigationItemActive(pathname, item.href)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-md border-l-2 border-transparent px-3 text-base font-medium text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
                        active &&
                          "border-primary bg-secondary font-semibold text-primary"
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
            <div className="border-t border-border bg-muted/55 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href={reservationItem.href}
                onClick={() => setOpen(false)}
                aria-current={
                  isNavigationItemActive(pathname, reservationItem.href)
                    ? "page"
                    : undefined
                }
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full"
                )}
              >
                {reservationItem.label}
              </Link>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { MobileNavigation }

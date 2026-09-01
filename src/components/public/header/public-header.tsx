import Link from "next/link"

import { ClubBrand } from "@/components/public/club-brand"
import { DesktopNavigation } from "@/components/public/header/desktop-navigation"
import { MobileNavigation } from "@/components/public/header/mobile-navigation"
import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-subtle">
      <PageContainer className="flex h-16 items-center gap-3 xl:h-18">
        <ClubBrand className="mr-auto shrink-0" />
        <DesktopNavigation />

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/reservas"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "px-3"
            )}
          >
            Reservar
          </Link>
          <MobileNavigation />
        </div>
      </PageContainer>
    </header>
  )
}

export { PublicHeader }

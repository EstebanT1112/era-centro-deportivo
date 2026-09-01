import Image from "next/image"
import Link from "next/link"

import { SITE_IMAGES } from "@/constants/assets"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface AdminBrandProps {
  compact?: boolean
  inverse?: boolean
}

function AdminBrand({ compact = false, inverse = false }: AdminBrandProps) {
  return (
    <Link
      href="/admin"
      aria-label={`${siteConfig.clubName}, panel de administración`}
      className="inline-flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <span className={cn("relative size-10 shrink-0", inverse && "drop-shadow-sm")}>
        <Image src={SITE_IMAGES.brand.logo} alt="" fill sizes="40px" className="object-contain" />
      </span>
      {!compact ? (
        <span className="flex min-w-0 flex-col">
          <span className={cn("truncate font-heading text-sm font-semibold", inverse && "text-primary-foreground")}>{siteConfig.shortName} Admin</span>
          <span className={cn("truncate text-xs text-muted-foreground", inverse && "text-primary-foreground/65")}>Panel de administración</span>
        </span>
      ) : null}
    </Link>
  )
}

export { AdminBrand }

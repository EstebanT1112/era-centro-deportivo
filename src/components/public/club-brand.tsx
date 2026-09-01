import Image from "next/image"
import Link from "next/link"

import { SITE_IMAGES } from "@/constants/assets"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface ClubBrandProps {
  variant?: "default" | "inverse"
  className?: string
}

function ClubBrand({ variant = "default", className }: ClubBrandProps) {
  const inverse = variant === "inverse"

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.clubName}, inicio`}
      className={cn(
        "group inline-flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
        className
      )}
    >
      <span
        className={cn(
          "relative size-11 shrink-0 transition-transform duration-200 group-hover:scale-[1.03]",
          inverse && "drop-shadow-sm"
        )}
      >
        <Image
          src={SITE_IMAGES.brand.logo}
          alt=""
          fill
          sizes="44px"
          className="object-contain"
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate font-display text-xl leading-none font-bold",
            inverse ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {siteConfig.shortName}
        </span>
        <span
          className={cn(
            "hidden truncate text-xs sm:block",
            inverse ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {siteConfig.descriptor}
        </span>
      </span>
    </Link>
  )
}

export { ClubBrand }

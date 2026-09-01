import Image from "next/image"

import { cn } from "@/lib/utils"

const avatarSizes = {
  sm: "size-10 text-xs",
  default: "size-14 text-sm",
  lg: "size-24 text-xl",
} as const

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "PR"
}

function TeacherAvatar({ name, image, size = "default", className }: { name: string; image?: string; size?: keyof typeof avatarSizes; className?: string }) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary font-heading font-semibold text-primary", avatarSizes[size], className)}>
      {image ? <Image src={image} alt="" fill sizes={size === "lg" ? "96px" : size === "sm" ? "40px" : "56px"} className="object-cover" unoptimized={image.startsWith("data:")} /> : <span aria-hidden="true">{getInitials(name)}</span>}
    </div>
  )
}

export { TeacherAvatar }

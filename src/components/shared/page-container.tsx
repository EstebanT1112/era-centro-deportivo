import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pageContainerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      public: "max-w-7xl",
      admin: "max-w-[90rem]",
      hero: "max-w-[86rem]",
      reading: "max-w-3xl",
      form: "max-w-2xl",
    },
  },
  defaultVariants: {
    size: "public",
  },
})

function PageContainer({
  className,
  size = "public",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof pageContainerVariants>) {
  return (
    <div
      data-slot="page-container"
      className={cn(pageContainerVariants({ size }), className)}
      {...props}
    />
  )
}

export { PageContainer, pageContainerVariants }

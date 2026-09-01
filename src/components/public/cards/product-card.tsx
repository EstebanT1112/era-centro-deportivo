import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, MessageCircleIcon, PackageCheckIcon, PackageXIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { siteConfig } from "@/config/site"
import { HOME_IMAGES } from "@/constants/assets"
import type { Product } from "@/types"

function ProductCard({ product }: { product: Product }) {
  return (
    <Card interactive size="sm" className="h-full">
      <div className="relative -mt-(--card-spacing) aspect-square overflow-hidden bg-background-subtle">
        <Image
          src={product.images[0] ?? HOME_IMAGES.product}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <Badge variant={product.isAvailable ? "success" : "danger"} className="mb-2">
          {product.isAvailable ? <PackageCheckIcon data-icon="inline-start" aria-hidden="true" /> : <PackageXIcon data-icon="inline-start" aria-hidden="true" />}
          {product.isAvailable ? "Disponible" : "No disponible"}
        </Badge>
        <CardTitle>
          <h3 className="font-display text-h4 text-balance">{product.name}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1">
        <p className="type-caption text-muted-foreground">{product.category}</p>
        <p className="text-lg font-bold tabular-nums text-foreground">
          {formatCurrency(product.price)}
        </p>
      </CardContent>
      <CardFooter className="flex-col">
        <Link
          href={`/tienda/${product.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Ver producto
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
        <a
          href={buildWhatsAppUrl(siteConfig.contact.whatsapp.number, `Hola, quiero consultar por ${product.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          <MessageCircleIcon data-icon="inline-start" />
          Consultar por WhatsApp
        </a>
      </CardFooter>
    </Card>
  )
}

export { ProductCard }

"use client"

import { useState } from "react"
import { MessageCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { siteConfig } from "@/config/site"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

function ProductConsultation({ product }: { product: Product }) {
  const firstAvailable = product.variants.find((variant) => variant.available)?.label ?? ""
  const [variant, setVariant] = useState(firstAvailable)
  const message = `Hola, quiero consultar por ${product.name}${variant ? `, ${variant}` : ""}.`
  const href = buildWhatsAppUrl(siteConfig.contact.whatsapp.number, message)

  return (
    <div className="flex flex-col gap-6">
      <Badge variant={product.isAvailable ? "success" : "danger"}>{product.isAvailable ? "Disponible" : "No disponible"}</Badge>
      {product.variants.length ? <FieldSet><FieldLegend variant="label">Elegí una variante</FieldLegend><ToggleGroup value={variant ? [variant] : []} onValueChange={(values) => { const next = values.at(-1); if (next) setVariant(next) }} variant="outline" className="flex-wrap" aria-label="Variantes del producto">{product.variants.map((item) => <ToggleGroupItem key={item.label} value={item.label} disabled={!item.available}>{item.label}{!item.available ? <span className="sr-only">, no disponible</span> : null}</ToggleGroupItem>)}</ToggleGroup></FieldSet> : <p className="text-sm text-muted-foreground">Este producto no requiere selección de variante.</p>}
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full")}><MessageCircleIcon data-icon="inline-start" />Consultar por WhatsApp</a>
      <p className="text-sm text-pretty text-muted-foreground">La consulta abre WhatsApp con el producto y la variante seleccionada. No se realiza ninguna compra online.</p>
    </div>
  )
}

export { ProductConsultation }

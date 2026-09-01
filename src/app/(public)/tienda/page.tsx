import type { Metadata } from "next"

import { ProductCatalog } from "@/components/public/store/product-catalog"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { getVisibleProducts } from "@/lib/mock-selectors"

export const metadata: Metadata = { title: "Tienda", description: "Catálogo de indumentaria y accesorios de Espacio ERA." }

export default function StorePage() {
  return <><section className="border-b border-border bg-background-subtle py-10 md:py-14"><PageContainer><PageHeader title="Tienda de ERA" description="Indumentaria y accesorios para llevar la identidad de ERA. Consultá disponibilidad por WhatsApp." className="border-0 pb-0" /></PageContainer></section><section className="py-10 md:py-14"><PageContainer><ProductCatalog products={getVisibleProducts()} /></PageContainer></section></>
}

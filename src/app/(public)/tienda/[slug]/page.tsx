import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductConsultation } from "@/components/public/store/product-consultation"
import { ProductGallery } from "@/components/public/store/product-gallery"
import { PageContainer } from "@/components/shared/page-container"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { getProductBySlug } from "@/lib/mock-selectors"
import { getVisibleProducts } from "@/lib/mock-selectors"

export function generateStaticParams() {
  return getVisibleProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProductBySlug((await params).slug)
  if (!product) return { title: "Producto no encontrado" }
  return { title: product.name, description: product.description }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-8 md:py-12"><PageContainer><nav aria-label="Migas de pan" className="type-caption flex flex-wrap items-center gap-2 text-muted-foreground"><Link href="/tienda" className="hover:text-primary">Tienda</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav></PageContainer></section>
      <PageContainer className="py-10 md:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ProductGallery images={product.images} productName={product.name} />
          <Card className="lg:sticky lg:top-24">
            <CardHeader><Badge variant="outline" className="mb-3">{product.category}</Badge><CardTitle><h1 className="type-h1 text-balance">{product.name}</h1></CardTitle><p className="mt-3 text-2xl font-bold tabular-nums">{formatCurrency(product.price)}</p></CardHeader>
            <CardContent className="flex flex-col gap-7"><p className="text-base leading-relaxed text-pretty text-muted-foreground">{product.description}</p><ProductConsultation product={product} /></CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}

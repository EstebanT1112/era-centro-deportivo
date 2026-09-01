import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ProductCard } from "@/components/public/cards/product-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import type { Product } from "@/types"
import { HomeReveal, HomeRevealGroup } from "./home-reveal"

function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) {
    return null
  }

  return (
    <section className="bg-background-subtle py-16 md:py-20 lg:py-24">
      <PageContainer className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
        <HomeReveal>
          <SectionHeader
            eyebrow="Tienda de ERA"
            title="Llevá los colores de ERA"
            description="Una selección breve de indumentaria y accesorios oficiales. La cancha sigue siendo la protagonista."
            action={
              <Link href="/tienda" className={buttonVariants({ variant: "outline" })}>
                Visitar tienda
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            }
            className="lg:sticky lg:top-28 lg:flex-col lg:items-start"
          />
        </HomeReveal>
        <HomeRevealGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HomeRevealGroup>
      </PageContainer>
    </section>
  )
}

export { FeaturedProducts }

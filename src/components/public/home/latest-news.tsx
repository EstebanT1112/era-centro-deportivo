import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { PostCard } from "@/components/public/cards/post-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import type { Post } from "@/types"
import { HomeReveal, HomeRevealGroup } from "./home-reveal"

function LatestNews({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return null
  }

  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <PageContainer className="flex flex-col gap-10">
        <HomeReveal><SectionHeader
          eyebrow="Actualidad ERA"
          title="ERA sigue en movimiento"
          description="Torneos, novedades e historias de nuestra comunidad deportiva."
          action={
            <Link href="/noticias" className={buttonVariants({ variant: "ghost" })}>
              Todas las noticias
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          }
        /></HomeReveal>
        <HomeRevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </HomeRevealGroup>
      </PageContainer>
    </section>
  )
}

export { LatestNews }

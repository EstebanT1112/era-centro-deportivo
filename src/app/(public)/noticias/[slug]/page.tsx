import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PostCard } from "@/components/public/cards/post-card"
import { ShareActions } from "@/components/public/news/share-actions"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatters"
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/mock-selectors"

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPostBySlug((await params).slug)
  if (!post) return { title: "Noticia no encontrada" }
  return { title: post.title, description: post.excerpt }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.id, post.category)

  return (
    <>
      <article>
        <header className="border-b border-border bg-background-subtle py-10 md:py-16">
          <PageContainer size="reading" className="flex flex-col gap-5">
            <nav aria-label="Migas de pan" className="type-caption flex flex-wrap items-center gap-2 text-muted-foreground"><Link href="/noticias" className="hover:text-primary">Noticias</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
            <div className="flex flex-wrap items-center gap-3"><Badge variant="outline">{post.category}</Badge>{post.publishedAt ? <time dateTime={post.publishedAt} className="type-caption text-muted-foreground">{formatDate(post.publishedAt)}</time> : null}</div>
            <h1 className="type-display text-balance text-foreground">{post.title}</h1>
            <p className="type-body-lg text-pretty text-muted-foreground">{post.excerpt}</p>
          </PageContainer>
        </header>

        <PageContainer size="reading" className="py-10 md:py-14">
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg bg-muted shadow-card"><Image src={post.coverImage} alt={`Imagen principal de ${post.title}`} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>
          <div className="flex flex-col gap-9 text-base leading-relaxed text-pretty md:text-lg">
            {post.content.map((block, index) => block.type === "heading" ? <h2 key={`${post.id}-block-${index}`} className="font-display text-h2 text-balance">{block.text}</h2> : block.type === "paragraph" ? <p key={`${post.id}-block-${index}`}>{block.text}</p> : <figure key={`${post.id}-block-${index}`} className="flex flex-col gap-2"><div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted"><Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>{block.caption ? <figcaption className="text-sm text-muted-foreground">{block.caption}</figcaption> : null}</figure>)}
            {post.secondaryImages?.map((image) => <figure key={image.src} className="flex flex-col gap-2"><div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>{image.caption ? <figcaption className="text-sm text-muted-foreground">{image.caption}</figcaption> : null}</figure>)}
          </div>
          <div className="mt-10 border-t border-border pt-6"><ShareActions title={post.title} /></div>
        </PageContainer>
      </article>

      {relatedPosts.length ? <section className="border-t border-border bg-background-subtle py-12 md:py-16"><PageContainer><SectionHeader eyebrow="Seguí leyendo" title="Noticias relacionadas" className="mb-8" /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{relatedPosts.map((related) => <PostCard key={related.id} post={related} />)}</div></PageContainer></section> : null}
    </>
  )
}

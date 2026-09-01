"use client"

import { useMemo, useState } from "react"
import { NewspaperIcon, XIcon } from "lucide-react"

import { PostCard } from "@/components/public/cards/post-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Post } from "@/types"
import { POST_CATEGORIES } from "@/constants/domain"

function NewsCatalog({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => POST_CATEGORIES.filter((item) => posts.some((post) => post.category === item)), [posts])
  const [category, setCategory] = useState("all")
  const filteredPosts = category === "all" ? posts : posts.filter((post) => post.category === category)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <ToggleGroup
          value={[category]}
          onValueChange={(values) => {
            const nextValue = values.at(-1)
            if (nextValue) setCategory(nextValue)
          }}
          variant="outline"
          className="flex-wrap"
          aria-label="Filtrar noticias por categoría"
        >
          <ToggleGroupItem value="all">Todas</ToggleGroupItem>
          {categories.map((item) => <ToggleGroupItem key={item} value={item}>{item}</ToggleGroupItem>)}
        </ToggleGroup>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <strong className="font-semibold text-foreground">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? "noticia" : "noticias"}
        </p>
      </div>

      {filteredPosts.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      ) : (
        <EmptyState
          icon={NewspaperIcon}
          titleAs="h2"
          title="No hay noticias en esta categoría"
          description="Volvé a ver todas las publicaciones disponibles."
          action={<Button variant="outline" onClick={() => setCategory("all")}><XIcon data-icon="inline-start" />Ver todas</Button>}
        />
      )}
    </div>
  )
}

export { NewsCatalog }

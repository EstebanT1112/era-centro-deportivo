import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Post } from "@/types"

function PostCard({ post }: { post: Post }) {
  return (
    <Card interactive className="h-full">
      <div className="relative -mt-(--card-spacing) aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.coverImage}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{post.category}</Badge>
          {post.publishedAt ? <time dateTime={post.publishedAt} className="type-caption text-muted-foreground">{formatDate(post.publishedAt)}</time> : null}
        </div>
        <CardTitle className="mt-2">
          <h3 className="font-display text-h3 text-balance">{post.title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/noticias/${post.slug}`}
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          Leer más
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Card>
  )
}

export { PostCard }

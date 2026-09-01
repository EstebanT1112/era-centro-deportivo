import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, MapPinIcon, UsersRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HOME_IMAGES } from "@/constants/assets"
import { getActiveDisciplineCategories } from "@/lib/disciplines"
import { cn } from "@/lib/utils"
import type { Discipline } from "@/types"

interface DisciplineCardProps {
  discipline: Discipline
  variant?: "default" | "featured"
  eager?: boolean
}

function DisciplineCard({ discipline, variant = "default", eager = false }: DisciplineCardProps) {
  const categories = getActiveDisciplineCategories(discipline)
  const categoryNames = categories.slice(0, 3).map((category) => category.name)
  const remainingCategories = categories.length - categoryNames.length
  const image = discipline.coverImage || HOME_IMAGES.community

  return (
    <Card interactive className="h-full">
      <div
        className={cn(
          "relative -mt-(--card-spacing) aspect-[16/10] overflow-hidden bg-muted",
          variant === "featured" && "sm:aspect-[16/9]"
        )}
      >
        <Image
          src={image}
          alt={`Entrenamiento de ${discipline.name} en Espacio ERA`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-150 group-hover/card:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
        />
        <div className="absolute left-4 top-4">
          <Badge variant="secondary">
            <UsersRoundIcon data-icon="inline-start" aria-hidden="true" />
            {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle>
          <h3 className="font-display text-h3 text-balance">{discipline.name}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
          {discipline.shortDescription}
        </p>
        {categoryNames.length ? (
          <p className="text-sm font-medium text-foreground">
            <span className="sr-only">Categorías: </span>
            {categoryNames.join(" · ")}
            {remainingCategories > 0 ? ` · +${remainingCategories}` : ""}
          </p>
        ) : null}
        {discipline.location ? (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{discipline.location}</span>
          </div>
        ) : null}
      </CardContent>

      <CardFooter>
        <Link
          href={`/disciplinas/${discipline.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          aria-label={`Ver disciplina ${discipline.name}`}
        >
          Ver disciplina
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  )
}

export { DisciplineCard }

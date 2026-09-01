import Image from "next/image"
import { MailIcon, MessageCircleIcon, UserRoundIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { buildDisciplineWhatsAppUrl } from "@/lib/disciplines"
import { cn } from "@/lib/utils"
import type { Teacher } from "@/types"

interface TeacherCardProps {
  teacher: Teacher
  disciplineName: string
  categoryName?: string
  compact?: boolean
  headingLevel?: "h3" | "h5"
}

function TeacherCard({
  teacher,
  disciplineName,
  categoryName,
  compact = false,
  headingLevel = "h5",
}: TeacherCardProps) {
  const Heading = headingLevel
  const contactUrl = buildDisciplineWhatsAppUrl({
    phone: teacher.phone,
    disciplineName,
    categoryName,
  })

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-subtle",
        compact && "sm:flex-row sm:items-center"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
          {teacher.image ? (
            <Image
              src={teacher.image}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <UserRoundIcon className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <Heading className="font-semibold text-balance text-foreground">{teacher.name}</Heading>
          {teacher.bio ? (
            <p className={cn("mt-1 text-sm text-pretty text-muted-foreground", compact && "line-clamp-2")}>{teacher.bio}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Profesor del centro</p>
          )}
          {teacher.email && !compact ? (
            <a
              href={`mailto:${teacher.email}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <MailIcon className="size-4" aria-hidden="true" />
              {teacher.email}
            </a>
          ) : null}
        </div>
      </div>

      <a
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "whatsapp", size: "sm" }),
          "w-full",
          compact && "sm:ml-auto sm:w-auto"
        )}
        aria-label={`Contactar a ${teacher.name} por WhatsApp sobre ${disciplineName}${categoryName ? ` ${categoryName}` : ""}`}
      >
        <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
        Contactar
      </a>
    </article>
  )
}

export { TeacherCard }

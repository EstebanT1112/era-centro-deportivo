import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  MapPinIcon,
  MessageCircleIcon,
  UsersRoundIcon,
} from "lucide-react"

import { DisciplineCategoryCard } from "@/components/public/disciplines/discipline-category-card"
import { DisciplineGallery } from "@/components/public/disciplines/discipline-gallery"
import { TeacherCard } from "@/components/public/disciplines/teacher-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { HOME_IMAGES } from "@/constants/assets"
import {
  buildDisciplineWhatsAppUrl,
  getActiveDisciplineCategories,
  getDisciplineBySlug,
  getDisciplineGalleryImages,
  getSortedDisciplineSchedules,
  getVisibleDisciplines,
  getWeekdayLabel,
} from "@/lib/disciplines"
import { getActiveTeachersByIds } from "@/lib/teachers"
import { cn } from "@/lib/utils"

export const dynamicParams = false

export function generateStaticParams() {
  return getVisibleDisciplines().map((discipline) => ({ slug: discipline.slug }))
}

export async function generateMetadata({ params }: PageProps<"/disciplinas/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const discipline = getDisciplineBySlug(slug)

  return discipline
    ? { title: discipline.name, description: discipline.shortDescription }
    : { title: "Disciplina no encontrada" }
}

export default async function DisciplineDetailPage({ params }: PageProps<"/disciplinas/[slug]">) {
  const { slug } = await params
  const discipline = getDisciplineBySlug(slug)

  if (!discipline) notFound()

  const categories = getActiveDisciplineCategories(discipline)
  const responsibleTeachers = getActiveTeachersByIds(discipline.responsibleTeacherIds)
  const galleryImages = getDisciplineGalleryImages(discipline)
  const weekdays = [...new Set(getSortedDisciplineSchedules(categories.flatMap((category) => category.schedules)).map((schedule) => schedule.weekday))]
    .map(getWeekdayLabel)
  const primaryTeacher = responsibleTeachers[0]

  return (
    <>
      <section className="border-b border-border bg-background-subtle py-8 md:py-12">
        <PageContainer size="hero" className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="flex flex-col items-start gap-5 lg:pl-8">
            <Link
              href="/disciplinas"
              className="inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-semibold text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Todas las disciplinas
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <UsersRoundIcon data-icon="inline-start" aria-hidden="true" />
                {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
              </Badge>
              {discipline.location ? (
                <Badge variant="outline">
                  <MapPinIcon data-icon="inline-start" aria-hidden="true" />
                  {discipline.location}
                </Badge>
              ) : null}
            </div>
            <div>
              <p className="type-label text-primary">Disciplina del centro deportivo</p>
              <h1 className="mt-2 type-h1 text-foreground">{discipline.name}</h1>
              <p className="mt-4 type-body-lg max-w-2xl text-muted-foreground">
                {discipline.shortDescription}
              </p>
            </div>
            {primaryTeacher ? (
              <a
                href={buildDisciplineWhatsAppUrl({ phone: primaryTeacher.phone, disciplineName: discipline.name })}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "whatsapp", size: "lg" })}
                aria-label={`Contactar a ${primaryTeacher.name} por WhatsApp sobre ${discipline.name}`}
              >
                <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
                Consultar por WhatsApp
              </a>
            ) : null}
          </div>

          <div className="relative min-w-0 aspect-[16/11] overflow-hidden rounded-xl border border-border bg-muted shadow-card lg:aspect-auto lg:min-h-[30rem]">
            <Image
              src={discipline.coverImage || HOME_IMAGES.community}
              alt={`Entrenamiento de ${discipline.name} en Espacio ERA`}
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-primary-active/90 p-4 text-primary-foreground sm:p-5">
              <p className="text-sm font-semibold text-pretty">Entrená, aprendé y compartí el deporte en Espacio ERA.</p>
            </div>
          </div>
        </PageContainer>
      </section>

      <div className="bg-background">
        <PageContainer className="flex flex-col gap-16 py-12 md:gap-20 md:py-16 lg:py-20">
          <section aria-labelledby="discipline-about-heading" className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-12">
            <div className="max-w-3xl">
              <p className="type-label text-primary">La propuesta</p>
              <h2 id="discipline-about-heading" className="mt-2 type-h2 text-foreground">Conocé {discipline.name}</h2>
              <p className="mt-5 type-body-lg text-muted-foreground">{discipline.description}</p>
            </div>
            <dl className="grid gap-4 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-start gap-3">
                <UsersRoundIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div><dt className="text-sm font-semibold text-foreground">Categorías</dt><dd className="mt-1 text-sm text-muted-foreground">{categories.length} activas</dd></div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div><dt className="text-sm font-semibold text-foreground">Días de actividad</dt><dd className="mt-1 text-sm text-pretty text-muted-foreground">{weekdays.length ? weekdays.join(", ") : "A confirmar"}</dd></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div><dt className="text-sm font-semibold text-foreground">Lugar general</dt><dd className="mt-1 text-sm text-muted-foreground">{discipline.location ?? "Consultar al centro"}</dd></div>
              </div>
            </dl>
          </section>

          <section className="flex flex-col gap-8">
            <SectionHeader
              eyebrow="Entrenamientos"
              title="Categorías, días y profesores"
              description="Revisá la propuesta correspondiente a cada edad y contactá directamente al profesor a cargo."
            />
            {categories.length ? (
              <div className="flex flex-col gap-5">
                {categories.map((category) => (
                  <DisciplineCategoryCard key={category.id} discipline={discipline} category={category} />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-border bg-surface p-6 text-pretty text-muted-foreground">Las categorías de esta disciplina se están reorganizando. Consultá al centro para conocer las próximas opciones.</p>
            )}
          </section>

          <section className="flex flex-col gap-8">
            <SectionHeader
              eyebrow="Comunidad deportiva"
              title={`${discipline.name} en imágenes`}
              description="Entrenamientos, espacios y momentos que forman parte de la actividad."
            />
            <DisciplineGallery disciplineName={discipline.name} images={galleryImages} />
          </section>

          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
            {discipline.requirements ? (
              <section aria-labelledby="discipline-requirements-heading" className="rounded-xl border border-border bg-background-subtle p-6 md:p-8">
                <ClipboardCheckIcon className="size-6 text-primary" aria-hidden="true" />
                <h2 id="discipline-requirements-heading" className="mt-4 font-display text-h3 text-balance text-foreground">Requisitos para comenzar</h2>
                <p className="mt-3 text-pretty text-muted-foreground">{discipline.requirements}</p>
              </section>
            ) : null}

            {responsibleTeachers.length ? (
              <section aria-labelledby="discipline-coordination-heading">
                <p className="type-label text-primary">Equipo responsable</p>
                <h2 id="discipline-coordination-heading" className="mt-2 font-display text-h3 text-balance text-foreground">Coordinación de la disciplina</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {responsibleTeachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} disciplineName={discipline.name} headingLevel="h3" />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </PageContainer>
      </div>

      <section className="bg-primary-active py-12 text-primary-foreground md:py-16">
        <PageContainer className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="type-label text-accent">Próximo paso</p>
            <h2 className="mt-2 type-h2 text-primary-foreground">¿Querés saber más sobre {discipline.name}?</h2>
            <p className="mt-3 text-pretty text-primary-foreground/72">Consultá horarios, requisitos o la categoría indicada antes de acercarte al centro deportivo.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {primaryTeacher ? (
              <a
                href={buildDisciplineWhatsAppUrl({ phone: primaryTeacher.phone, disciplineName: discipline.name })}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "whatsapp", size: "lg" })}
                aria-label={`Contactar a ${primaryTeacher.name} por WhatsApp sobre ${discipline.name}`}
              >
                <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
                Contactar a {primaryTeacher.name.split(" ")[0]}
              </a>
            ) : null}
            <a
              href={siteConfig.contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Consultar al centro
            </a>
          </div>
        </PageContainer>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, Clock3Icon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { clubServices } from "@/components/public/home/services-section"
import { LocationMap } from "@/components/public/location-map"
import { ServiceItem } from "@/components/public/service-item"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import { formatOpeningHoursSummary, siteConfig } from "@/config/site"
import { siteContent } from "@/mocks"

export const metadata: Metadata = {
  title: "El centro deportivo",
  description: "Conocé la historia, los valores y las instalaciones de Espacio ERA.",
}

const historyLabels = [
  { year: "1998", title: "Un lugar para encontrarnos" },
  { year: "2012", title: "Más canchas, más comunidad" },
  { year: "Hoy", title: "Identidad de barrio, nivel profesional" },
]
const history = siteContent.club.history.split("\n\n").map((text, index) => ({ ...(historyLabels[index] ?? { year: "ERA", title: "Nuestra historia" }), text }))

const facilityImages = siteContent.club.images.map((src, index) => ({ src, alt: `Instalación ${index + 1} de Espacio ERA` }))
const visibleServices = siteContent.club.serviceIds.map((id) => clubServices.find((service) => service.id === id)).filter(Boolean)

export default function ClubPage() {
  return (
    <>
      <section className="border-b border-border bg-background-subtle py-10 md:py-14">
        <PageContainer><PageHeader title={siteContent.club.introTitle} description={siteContent.club.introText} className="border-0 pb-0" /></PageContainer>
      </section>

      <section className="py-14 md:py-20 lg:py-24">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex max-w-xl flex-col gap-5">
            <p className="type-label text-primary">Nuestra identidad</p>
            <h2 className="type-h2 text-foreground">Competir, compartir y volver</h2>
            <div className="flex flex-col gap-4 text-pretty text-muted-foreground">
              <p>{siteContent.club.introText}</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-card">
            <Image src={siteContent.club.images[0]} alt="La comunidad de Espacio ERA compartiendo una jornada deportiva" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border bg-surface py-14 md:py-20">
        <PageContainer>
          <SectionHeader eyebrow="Trayectoria" title="Una historia que sigue en movimiento" description="Tres momentos que explican cómo Espacio ERA creció junto a Villa Elisa." className="mb-10" />
          <ol className="grid gap-8 md:grid-cols-3">
            {history.map((item) => <li key={item.year} className="border-t-2 border-primary pt-5"><p className="font-display text-h3 tabular-nums text-primary">{item.year}</p><h3 className="mt-3 font-display text-h4 text-balance">{item.title}</h3><p className="mt-2 text-pretty text-muted-foreground">{item.text}</p></li>)}
          </ol>
        </PageContainer>
      </section>

      <section className="py-14 md:py-20">
        <PageContainer>
          <SectionHeader eyebrow="Instalaciones" title="Espacios preparados para vivir el deporte" description="Canchas, vestuarios y sectores comunes cuidados para cada momento de la visita." className="mb-8" />
          <div className="grid auto-rows-[11rem] gap-3 sm:grid-cols-2 md:auto-rows-[14rem] lg:grid-cols-4">
            {facilityImages.map((image, index) => <div key={`${image.src}-${index}`} className={index === 0 ? "relative overflow-hidden rounded-lg sm:row-span-2 lg:col-span-2" : "relative overflow-hidden rounded-lg"}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" /></div>)}
          </div>
        </PageContainer>
      </section>

      <section className="bg-background-subtle py-14 md:py-20">
        <PageContainer>
          <SectionHeader eyebrow="Servicios" title="Todo lo necesario para venir a jugar" description="La misma experiencia clara y cuidada en cada sector del centro deportivo." className="mb-8" />
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">{visibleServices.map((service) => service ? <ServiceItem key={service.id} {...service} variant="surface" /> : null)}</div>
        </PageContainer>
      </section>

      <section className="py-14 md:py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader eyebrow="Horarios" title="El centro durante la semana" description="Horarios generales simulados. La disponibilidad de cada cancha se consulta al reservar." className="mb-6" />
            <dl className="overflow-hidden rounded-lg border border-border bg-surface shadow-subtle">{siteConfig.contact.openingHours.map((day) => <div key={day.weekday} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0 sm:px-5"><dt className="font-medium">{day.label}</dt><dd className="tabular-nums text-muted-foreground">{day.enabled ? `${day.openTime} — ${day.closeTime}` : "Cerrado"}</dd></div>)}</dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
            <LocationMap className="min-h-72" />
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <h2 className="font-display text-h3">Encontranos</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex gap-3"><MapPinIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{siteConfig.contact.address}</a></li>
                <li className="flex gap-3"><PhoneIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.phone.href} className="hover:underline">{siteConfig.contact.phone.display}</a></li>
                <li className="flex gap-3"><MailIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.email.href} className="hover:underline">{siteConfig.contact.email.display}</a></li>
                <li className="flex gap-3"><Clock3Icon className="size-5 shrink-0 text-primary" aria-hidden="true" /><span>{formatOpeningHoursSummary()}</span></li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-primary py-14 text-primary-foreground md:py-16">
        <PageContainer className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl"><p className="type-label text-accent">Tu próximo partido</p><h2 className="mt-2 type-h2 text-primary-foreground">Elegí cancha y reservá tu turno</h2></div>
          <Link href="/reservas" className={buttonVariants({ variant: "secondary", size: "lg" })}>Reservar cancha<ArrowRightIcon data-icon="inline-end" /></Link>
        </PageContainer>
      </section>
    </>
  )
}

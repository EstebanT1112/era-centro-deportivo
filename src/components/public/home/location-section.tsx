import Link from "next/link"
import {
  ArrowRightIcon,
  CameraIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  UsersRoundIcon,
} from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { LocationMap } from "@/components/public/location-map"
import { buttonVariants } from "@/components/ui/button"
import { formatOpeningHoursSummary, siteConfig } from "@/config/site"
import { HomeReveal } from "./home-reveal"

const socialIcons = {
  Instagram: CameraIcon,
  Facebook: UsersRoundIcon,
} as const

function LocationSection() {
  return (
    <section className="bg-background-subtle py-16 md:py-20 lg:py-24">
      <PageContainer>
        <HomeReveal className="grid overflow-hidden rounded-lg border border-border bg-surface shadow-card lg:grid-cols-[1.1fr_0.9fr]" distance={18}>
          <LocationMap className="min-h-[22rem] lg:min-h-[38rem]" />
          <div className="flex flex-col justify-center gap-7 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3">
            <p className="type-label text-primary">Contacto y ubicación</p>
            <h2 className="type-h2 text-foreground">Vení a conocer ERA</h2>
            <p className="text-pretty text-muted-foreground">
              Consultanos antes de venir o acercate durante el horario habitual del centro deportivo.
            </p>
          </div>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <a className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring/30" href={siteConfig.contact.mapUrl} target="_blank" rel="noopener noreferrer">
                {siteConfig.contact.address}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <a className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring/30" href={siteConfig.contact.phone.href}>
                {siteConfig.contact.phone.display}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <a className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring/30" href={siteConfig.contact.email.href}>
                {siteConfig.contact.email.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock3Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{formatOpeningHoursSummary()}</span>
            </li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp" })}
            >
              <MessageCircleIcon data-icon="inline-start" />
              Consultar por WhatsApp
            </a>
            <Link href="/contacto" className={buttonVariants({ variant: "outline" })}>
              Ver contacto
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">Seguinos:</span>
            {siteConfig.socials.map((social) => {
              const Icon = socialIcons[social.label]

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} de ${siteConfig.shortName}`}
                  className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground outline-none transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              )
            })}
          </div>
          </div>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { LocationSection }

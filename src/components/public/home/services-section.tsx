import {
  CarFrontIcon,
  CookingPotIcon,
  LampCeilingIcon,
  LockKeyholeIcon,
  ShowerHeadIcon,
  UsersRoundIcon,
} from "lucide-react"

import { ServiceItem } from "@/components/public/service-item"
import { PageContainer } from "@/components/shared/page-container"
import { siteContent } from "@/mocks"
import { HomeReveal, HomeRevealGroup } from "./home-reveal"

const serviceIcons = {
  vestuarios: LockKeyholeIcon,
  duchas: ShowerHeadIcon,
  iluminacion: LampCeilingIcon,
  estacionamiento: CarFrontIcon,
  buffet: CookingPotIcon,
  "espacios-comunes": UsersRoundIcon,
} as const

const clubServices = siteContent.services.map((service) => ({
  ...service,
  icon: serviceIcons[service.id as keyof typeof serviceIcons] ?? UsersRoundIcon,
}))

function ServicesSection() {
  return (
    <section className="bg-primary-active py-16 md:py-20">
      <PageContainer className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <HomeReveal className="flex max-w-lg flex-col gap-4">
          <p className="type-label text-accent">Servicios e instalaciones</p>
          <h2 className="type-h2 text-primary-foreground">
            Todo lo necesario para venir a jugar
          </h2>
          <p className="type-body-lg text-primary-foreground/72">
            Una experiencia deportiva completa, desde que llegás hasta que termina el tercer tiempo.
          </p>
        </HomeReveal>
        <HomeRevealGroup className="grid gap-x-8 gap-y-7 sm:grid-cols-2" delay={0.05} stagger={0.06}>
          {clubServices.map((service) => (
            <ServiceItem key={service.title} {...service} />
          ))}
        </HomeRevealGroup>
      </PageContainer>
    </section>
  )
}

export { ServicesSection, clubServices }

import type { Metadata } from "next"
import { CameraIcon, Clock3Icon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon, UsersRoundIcon } from "lucide-react"

import { ContactForm } from "@/components/public/contact/contact-form"
import { LocationMap } from "@/components/public/location-map"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatOpeningHoursSummary, siteConfig } from "@/config/site"

export const metadata: Metadata = { title: "Contacto", description: "Comunicate con Espacio ERA y consultá ubicación, horarios y medios de contacto." }

const socialIcons = { Instagram: CameraIcon, Facebook: UsersRoundIcon } as const

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-background-subtle py-10 md:py-14"><PageContainer><PageHeader title="Hablemos" description="Consultanos por reservas, actividades, tienda o cualquier información del centro deportivo." className="border-0 pb-0" /></PageContainer></section>
      <PageContainer className="py-10 md:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card><CardHeader><CardTitle><h2 className="font-display text-h3">Datos del centro deportivo</h2></CardTitle></CardHeader><CardContent className="flex flex-col gap-5"><ul className="flex flex-col gap-4 text-sm"><li className="flex gap-3"><MapPinIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{siteConfig.contact.address}</a></li><li className="flex gap-3"><PhoneIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.phone.href} className="hover:underline">{siteConfig.contact.phone.display}</a></li><li className="flex gap-3"><MessageCircleIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.whatsapp.href} target="_blank" rel="noreferrer" className="hover:underline">{siteConfig.contact.whatsapp.display}</a></li><li className="flex gap-3"><MailIcon className="size-5 shrink-0 text-primary" aria-hidden="true" /><a href={siteConfig.contact.email.href} className="hover:underline">{siteConfig.contact.email.display}</a></li><li className="flex gap-3"><Clock3Icon className="size-5 shrink-0 text-primary" aria-hidden="true" /><span>{formatOpeningHoursSummary()}</span></li></ul><a href={siteConfig.contact.whatsapp.href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "whatsapp" })}><MessageCircleIcon data-icon="inline-start" />Consultar por WhatsApp</a><div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Redes:</span>{siteConfig.socials.map((social) => { const Icon = socialIcons[social.label]; return <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`${social.label} de ${siteConfig.shortName}`} className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30"><Icon className="size-5" aria-hidden="true" /></a> })}</div></CardContent></Card>
            <LocationMap className="min-h-72 rounded-lg border border-border shadow-subtle" />
          </div>
          <Card><CardHeader><CardTitle><h2 className="font-display text-h2">Envianos una consulta</h2></CardTitle><p className="mt-2 text-pretty text-muted-foreground">Completá los datos y simulá el envío del mensaje.</p></CardHeader><CardContent><ContactForm /></CardContent></Card>
        </div>
      </PageContainer>
    </>
  )
}

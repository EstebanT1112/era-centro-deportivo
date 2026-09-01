import Link from "next/link"
import {
  CameraIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  UsersRoundIcon,
} from "lucide-react"

import { ClubBrand } from "@/components/public/club-brand"
import { PageContainer } from "@/components/shared/page-container"
import { Separator } from "@/components/ui/separator"
import { formatOpeningHoursSummary, siteConfig } from "@/config/site"
import {
  publicFooterNavigation,
  publicNavigation,
} from "@/constants/navigation"
const socialIcons = {
  Instagram: CameraIcon,
  Facebook: UsersRoundIcon,
} as const

const footerLinkClassName =
  "rounded-sm text-sm text-primary-foreground/72 outline-none transition-colors duration-150 hover:text-primary-foreground hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-accent/70"

function PublicFooter() {
  return (
    <footer className="border-t-4 border-accent bg-primary-active text-primary-foreground">
      <PageContainer className="py-12 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5 xl:gap-8">
          <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-1">
            <ClubBrand variant="inverse" />
            <p className="max-w-xs text-sm leading-6 text-primary-foreground/72">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2">
              {siteConfig.socials.map((social) => {
                const Icon = socialIcons[social.label]

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} de ${siteConfig.shortName}`}
                    className="flex size-10 items-center justify-center rounded-md border border-primary-foreground/20 text-primary-foreground/75 outline-none transition-colors duration-150 hover:border-accent hover:bg-primary-foreground/8 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          {publicFooterNavigation.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-lg font-semibold">
                {group.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {group.hrefs.map((href) => {
                  const item = publicNavigation.find(
                    (navigationItem) => navigationItem.href === href
                  )

                  return item ? (
                    <li key={`${group.title}-${href}`}>
                      <Link href={item.href} className={footerLinkClassName}>
                        {item.label}
                      </Link>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 xl:col-span-1">
            <h2 className="font-display text-lg font-semibold">Contacto</h2>
            <ul className="mt-4 flex flex-col gap-3.5 text-sm text-primary-foreground/72">
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={siteConfig.contact.mapUrl} target="_blank" rel="noopener noreferrer" className={footerLinkClassName}>
                  {siteConfig.contact.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={siteConfig.contact.phone.href} className={footerLinkClassName}>
                  {siteConfig.contact.phone.display}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircleIcon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={siteConfig.contact.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClassName}
                >
                  {siteConfig.contact.whatsapp.display}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={siteConfig.contact.email.href} className={footerLinkClassName}>
                  {siteConfig.contact.email.display}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock3Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{formatOpeningHoursSummary()}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/16" />
        <div className="flex flex-col gap-2 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.clubName}.</p>
          <p>Prototipo visual · Información institucional simulada</p>
        </div>
      </PageContainer>
    </footer>
  )
}

export { PublicFooter }

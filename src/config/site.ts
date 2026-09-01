import type { SiteConfig } from "@/types"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

const whatsappNumber = "5491123456789"
const whatsappMessage = "Hola, quiero consultar sobre el centro deportivo."

export const siteConfig: SiteConfig = {
  clubName: "Espacio ERA",
  shortName: "ERA",
  descriptor: "Centro deportivo",
  description:
    "Un centro deportivo de Villa Elisa con espacios preparados para jugar, entrenar y compartir.",
  contact: {
    address: "Arana 224, Villa Elisa, La Plata, Buenos Aires",
    phone: {
      display: "0221 355-6529",
      href: "tel:+542213556529",
    },
    whatsapp: {
      display: "+54 9 11 2345-6789",
      number: whatsappNumber,
      message: whatsappMessage,
      href: buildWhatsAppUrl(whatsappNumber, whatsappMessage),
    },
    email: {
      display: "contacto@eraclub.com.ar",
      href: "mailto:contacto@eraclub.com.ar",
    },
    openingHours: [
      { weekday: 1, label: "Lunes", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 2, label: "Martes", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 3, label: "Miércoles", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 4, label: "Jueves", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 5, label: "Viernes", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 6, label: "Sábado", enabled: true, openTime: "08:00", closeTime: "23:00" },
      { weekday: 0, label: "Domingo", enabled: true, openTime: "08:00", closeTime: "23:00" },
    ],
    mapUrl: "https://maps.app.goo.gl/SfciNgMwUDqMS1of9",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/prof.ricardo_amerio/" },
  ],
}

export function formatOpeningHoursSummary(openingHours = siteConfig.contact.openingHours) {
  const enabled = openingHours.filter((day) => day.enabled)
  if (!enabled.length) return "Centro cerrado"
  const sameHours = enabled.every((day) => day.openTime === enabled[0].openTime && day.closeTime === enabled[0].closeTime)
  if (enabled.length === 7 && sameHours) return `Lunes a domingo, de ${enabled[0].openTime} a ${enabled[0].closeTime}`
  return "Consultá los horarios semanales del centro deportivo"
}

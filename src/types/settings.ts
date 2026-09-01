import type { Weekday } from "./schedule"

export interface ReservationSettings {
  depositPercentage: number
  holdMinutes: number
  defaultSlotMinutes: number
  minAdvanceHours: number
  maxAdvanceDays: number
}

export interface OpeningHour {
  weekday: Weekday
  label: string
  enabled: boolean
  openTime?: string
  closeTime?: string
}

export interface SocialLink {
  label: "Instagram" | "Facebook"
  href: string
}

export interface SiteConfig {
  clubName: string
  shortName: string
  descriptor: string
  description: string
  contact: {
    address: string
    phone: { display: string; href: string }
    whatsapp: { display: string; number: string; message: string; href: string }
    email: { display: string; href: string }
    openingHours: OpeningHour[]
    mapUrl: string
  }
  socials: SocialLink[]
}

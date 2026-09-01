import type { Court, CourtTimeSlot, Reservation } from "@/types"

export type ReservationStep =
  | "court"
  | "schedule"
  | "customer"
  | "summary"
  | "redirect"
  | "verification"
  | "success"

export interface ReservationDraft {
  courtId?: Court["id"]
  date?: string
  time?: string
  firstName: string
  lastName: string
  phone: string
  email: string
  playerCount?: number
  notes: string
}

export type CustomerField =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "playerCount"

export type CustomerErrors = Partial<Record<CustomerField, string>>

export interface CompletedReservation {
  reservation: Reservation
  court: Court
  slot: CourtTimeSlot
  customer: Pick<
    ReservationDraft,
    "firstName" | "lastName" | "phone" | "email" | "playerCount" | "notes"
  >
}

export const EMPTY_RESERVATION_DRAFT: ReservationDraft = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: "",
}

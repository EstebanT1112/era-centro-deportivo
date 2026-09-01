import type { ReservationSettings } from "@/types"

export const reservationSettings: ReservationSettings = {
  depositPercentage: 50,
  holdMinutes: 10,
  defaultSlotMinutes: 60,
  minAdvanceHours: 2,
  maxAdvanceDays: 30,
}

export function calculateDeposit(total: number, settings = reservationSettings) {
  return total * (settings.depositPercentage / 100)
}

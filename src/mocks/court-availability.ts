import type { Court, CourtTimeSlot, TimeSlotStatus } from "@/types"

export const MOCK_BOOKING_DATES = [
  "2026-08-22",
  "2026-08-23",
  "2026-08-24",
  "2026-08-25",
  "2026-08-26",
  "2026-08-27",
  "2026-08-28",
] as const

const START_TIMES = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
const STATUS_PATTERNS: TimeSlotStatus[][] = [
  ["available", "occupied", "available", "blocked", "available", "occupied"],
  ["occupied", "available", "available", "occupied", "blocked", "available"],
  ["available", "available", "occupied", "available", "occupied", "blocked"],
]

function addMinutes(time: string, minutes: number) {
  const [hours, currentMinutes] = time.split(":").map(Number)
  const total = hours * 60 + currentMinutes + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

export function getMockCourtAvailability(
  court: Court,
  dates: readonly string[] = MOCK_BOOKING_DATES
) {
  return Object.fromEntries(
    dates.map((date, dateIndex) => {
      const pattern = STATUS_PATTERNS[(dateIndex + court.name.length) % STATUS_PATTERNS.length]
      const slots: CourtTimeSlot[] = START_TIMES.map((startTime, slotIndex) => ({
        id: `${court.id}-${date}-${startTime}`,
        courtId: court.id,
        date,
        startTime,
        endTime: addMinutes(startTime, court.slotMinutes),
        status: pattern[slotIndex],
      }))

      return [date, slots]
    })
  ) satisfies Record<string, CourtTimeSlot[]>
}

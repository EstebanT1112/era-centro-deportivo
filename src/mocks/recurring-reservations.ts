import type { RecurringReservation } from "@/types"

export const recurringReservations: RecurringReservation[] = [
  {
    id: "recurring-001",
    customerName: "Equipo Los Pinos",
    customerPhone: "+54 9 11 5555-0140",
    courtId: "court-norte",
    weekday: 2,
    startTime: "20:00",
    startDate: "2026-08-04",
    endDate: "2026-12-15",
    status: "active",
  },
  {
    id: "recurring-002",
    customerName: "Veteranos del Sur",
    customerPhone: "+54 9 11 5555-0151",
    courtId: "court-sur",
    weekday: 4,
    startTime: "21:00",
    startDate: "2026-07-02",
    endDate: "2026-10-29",
    status: "inactive",
  },
]

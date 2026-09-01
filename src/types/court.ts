import type { Weekday } from "./schedule";

export type CourtStatus = "active" | "inactive" | "maintenance";

export type CourtType = "futbol5" | "futbol7" | "futbol11";

export type CourtService =
  | "Vestuarios"
  | "Duchas"
  | "Estacionamiento"
  | "Tribuna"
  | "Buffet";

export type CourtFeature = "Techada" | "Iluminación";

export interface CourtWeeklySchedule {
  weekday: Weekday;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface CourtBlock {
  id: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export type TimeSlotStatus = "available" | "occupied" | "blocked";

export interface Court {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: CourtType;
  surface: string;
  status: CourtStatus;
  pricePerSlot: number;
  slotMinutes: number;
  services: CourtService[];
  features: CourtFeature[];
  images: string[];
  isFeatured: boolean;
  order: number;
  weeklySchedule: CourtWeeklySchedule[];
}

export interface CourtTimeSlot {
  id: string;
  courtId: Court["id"];
  date: string;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
}

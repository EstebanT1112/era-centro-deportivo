import { SITE_IMAGES } from "@/constants/assets";
import { WEEKDAYS } from "@/constants/domain";
import { reservationSettings } from "@/config/reservations";
import type { Court, CourtBlock, CourtStatus, CourtType } from "@/types";

export type CourtDraft = Omit<Court, "id" | "slug">;

export interface CourtFilters {
  query: string;
  type: "all" | CourtType;
  status: "all" | CourtStatus;
}

export const COURT_IMAGE_OPTIONS = [
  SITE_IMAGES.courts.norte,
  SITE_IMAGES.courts.sur,
  SITE_IMAGES.courts.central,
  SITE_IMAGES.courts.techada,
] as const;

export function slugifyCourtName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cloneCourt(court: Court): Court {
  return {
    ...court,
    services: [...court.services],
    features: [...court.features],
    images: [...court.images],
    weeklySchedule: court.weeklySchedule.map((day) => ({ ...day })),
  };
}

export function createEmptyCourt(order: number): CourtDraft {
  return {
    name: "",
    description: "",
    type: "futbol5",
    surface: "Césped sintético",
    status: "inactive",
    pricePerSlot: 42000,
    slotMinutes: reservationSettings.defaultSlotMinutes,
    services: [],
    features: [],
    images: [],
    isFeatured: false,
    order,
    weeklySchedule: WEEKDAYS.map(({ value }) => ({
      weekday: value,
      enabled: value !== 0,
      startTime: "08:00",
      endTime: "23:00",
    })),
  };
}

export function filterCourts(courts: Court[], filters: CourtFilters) {
  const query = filters.query.trim().toLocaleLowerCase("es-AR");
  return courts
    .filter((court) => {
      const typeLabel = court.type.replace("futbol", "fútbol ");
      return (
        (!query || `${court.name} ${typeLabel}`.toLocaleLowerCase("es-AR").includes(query)) &&
        (filters.type === "all" || court.type === filters.type) &&
        (filters.status === "all" || court.status === filters.status)
      );
    })
    .toSorted((a, b) => a.order - b.order || a.name.localeCompare(b.name, "es"));
}

export function validateCourt(draft: CourtDraft) {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = "Ingresá el nombre de la cancha.";
  if (!draft.description.trim()) errors.description = "Ingresá una descripción breve.";
  if (!draft.surface.trim()) errors.surface = "Ingresá la superficie.";
  if (!Number.isFinite(draft.pricePerSlot) || draft.pricePerSlot <= 0) {
    errors.pricePerSlot = "El precio por turno debe ser mayor que cero.";
  }
  if (!Number.isFinite(draft.slotMinutes) || draft.slotMinutes <= 0) {
    errors.slotMinutes = "Elegí una duración válida.";
  }
  if (!Number.isFinite(draft.order) || draft.order < 1) {
    errors.order = "El orden debe ser 1 o mayor.";
  }

  for (const day of draft.weeklySchedule) {
    if (day.enabled && (!day.startTime || !day.endTime || day.startTime >= day.endTime)) {
      errors[`schedule-${day.weekday}`] = "La hora de cierre debe ser posterior a la apertura.";
    }
  }
  return errors;
}

export function validateCourtBlock(input: Omit<CourtBlock, "id" | "courtId">) {
  const errors: Record<string, string> = {};
  if (!input.date) errors.date = "Elegí una fecha.";
  if (!input.startTime) errors.startTime = "Ingresá la hora de inicio.";
  if (!input.endTime) errors.endTime = "Ingresá la hora de finalización.";
  if (input.startTime && input.endTime && input.startTime >= input.endTime) {
    errors.endTime = "La hora de finalización debe ser posterior al inicio.";
  }
  if (!input.reason.trim()) errors.reason = "Ingresá el motivo del bloqueo.";
  return errors;
}

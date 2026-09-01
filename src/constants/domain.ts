import type {
  CourtStatus,
  CourtFeature,
  CourtService,
  CourtType,
  FaqCategory,
  GalleryCategory,
  PaymentStatus,
  ReservationStatus,
  TimeSlotStatus,
  Weekday,
} from "@/types";

export const POST_CATEGORIES = ["Institucional", "Torneos", "Centro", "Escuela"] as const;
export const PRODUCT_CATEGORIES = ["Indumentaria", "Abrigos", "Accesorios"] as const;

export const COURT_TYPES = [
  { value: "futbol5", label: "Fútbol 5" },
  { value: "futbol7", label: "Fútbol 7" },
  { value: "futbol11", label: "Fútbol 11" },
] as const satisfies ReadonlyArray<{ value: CourtType; label: string }>;

export const COURT_STATUSES = [
  { value: "active", label: "Activa" },
  { value: "inactive", label: "Inactiva" },
  { value: "maintenance", label: "En mantenimiento" },
] as const satisfies ReadonlyArray<{ value: CourtStatus; label: string }>;

export const COURT_SERVICES = [
  { value: "Vestuarios", label: "Vestuarios" },
  { value: "Duchas", label: "Duchas" },
  { value: "Estacionamiento", label: "Estacionamiento" },
  { value: "Tribuna", label: "Tribuna" },
  { value: "Buffet", label: "Buffet" },
] as const satisfies ReadonlyArray<{ value: CourtService; label: string }>;

export const COURT_FEATURES = [
  { value: "Techada", label: "Techada" },
  { value: "Iluminación", label: "Iluminación deportiva" },
] as const satisfies ReadonlyArray<{ value: CourtFeature; label: string }>;

export const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
] as const satisfies ReadonlyArray<{ value: Weekday; label: string }>;

export const WEEKDAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const TIME_SLOT_STATUSES = [
  { value: "available", label: "Disponible" },
  { value: "occupied", label: "Ocupado" },
  { value: "blocked", label: "Bloqueado" },
] as const satisfies ReadonlyArray<{ value: TimeSlotStatus; label: string }>;

export const RESERVATION_STATUSES = [
  { value: "pending_payment", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Finalizada" },
  { value: "expired", label: "Expirada" },
] as const satisfies ReadonlyArray<{
  value: ReservationStatus;
  label: string;
}>;

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pendiente" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
  { value: "refunded", label: "Reintegrado" },
] as const satisfies ReadonlyArray<{ value: PaymentStatus; label: string }>;

export const GALLERY_CATEGORIES = [
  { value: "canchas", label: "Canchas" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "partidos", label: "Partidos" },
  { value: "club", label: "Centro" },
  { value: "otros", label: "Otros" },
] as const satisfies ReadonlyArray<{ value: GalleryCategory; label: string }>;

export const FAQ_CATEGORIES = [
  { value: "reservas", label: "Reservas" },
  { value: "pagos", label: "Pagos" },
  { value: "canchas", label: "Canchas" },
  { value: "horarios", label: "Horarios" },
  { value: "tienda", label: "Tienda" },
  { value: "club", label: "Centro" },
] as const satisfies ReadonlyArray<{ value: FaqCategory; label: string }>;

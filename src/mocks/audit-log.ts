import type { AuditLogEntry } from "@/types"

export const auditLog: AuditLogEntry[] = [
  { id: "audit-1", timestamp: "2026-08-18T15:20:00-03:00", userId: "user-sofia", actionType: "payment", message: "registró el saldo de RES-A42F7 como pagado.", entityType: "reservation", entityId: "reservation-001" },
  { id: "audit-2", timestamp: "2026-08-18T14:10:00-03:00", userId: "user-admin", actionType: "update", message: "actualizó los datos y horarios de Cancha Norte.", entityType: "court", entityId: "court-norte" },
  { id: "audit-3", timestamp: "2026-08-18T12:30:00-03:00", userId: "user-admin", actionType: "publish", message: "publicó “Nuevo horario de verano”.", entityType: "post", entityId: "post-horario-verano" },
  { id: "audit-4", timestamp: "2026-08-18T10:00:00-03:00", userId: "user-martin", actionType: "create", message: "creó una reserva manual para Cancha Sur.", entityType: "reservation", entityId: "reservation-002" },
  { id: "audit-5", timestamp: "2026-08-17T18:45:00-03:00", userId: "user-admin", actionType: "block", message: "bloqueó Cancha Central por mantenimiento.", entityType: "court", entityId: "court-central" },
  { id: "audit-6", timestamp: "2026-08-17T16:05:00-03:00", userId: "user-sofia", actionType: "status_change", message: "confirmó la reserva RES-K81D2.", entityType: "reservation", entityId: "reservation-003" },
  { id: "audit-7", timestamp: "2026-08-16T11:15:00-03:00", userId: "user-admin", actionType: "update", message: "actualizó la configuración general de reservas.", entityType: "settings" },
]

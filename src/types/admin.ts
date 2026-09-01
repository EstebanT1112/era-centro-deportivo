export type AdminUserRole = "admin" | "employee"
export type AdminUserStatus = "active" | "inactive"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminUserRole
  status: AdminUserStatus
}

export type AuditActionType = "create" | "update" | "payment" | "status_change" | "publish" | "block" | "other"

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  actionType: AuditActionType
  message: string
  entityType?: "reservation" | "court" | "post" | "product" | "user" | "settings"
  entityId?: string
}

import type { AdminUser } from "@/types"

export const adminUsers: AdminUser[] = [
  { id: "user-admin", name: "Valentina Ruiz", email: "admin@eraclub.com.ar", role: "admin", status: "active" },
  { id: "user-sofia", name: "Sofía Fernández", email: "sofia@eraclub.com.ar", role: "employee", status: "active" },
  { id: "user-martin", name: "Martín Acosta", email: "martin@eraclub.com.ar", role: "employee", status: "active" },
  { id: "user-lucia", name: "Lucía Herrera", email: "lucia@eraclub.com.ar", role: "employee", status: "inactive" },
]

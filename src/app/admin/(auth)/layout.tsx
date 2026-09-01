import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Acceso administrativo",
  robots: { index: false, follow: false },
}

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return <main id="admin-login-content" className="min-h-dvh bg-background">{children}</main>
}

import type { ReactNode } from "react"

import { PublicFooter } from "@/components/public/footer/public-footer"
import { PublicHeader } from "@/components/public/header/public-header"
import { WhatsAppFloatingButton } from "@/components/public/whatsapp-floating-button"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-floating focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        Saltar al contenido
      </a>
      <PublicHeader />
      <main id="contenido-principal" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <WhatsAppFloatingButton />
      <PublicFooter />
    </div>
  )
}

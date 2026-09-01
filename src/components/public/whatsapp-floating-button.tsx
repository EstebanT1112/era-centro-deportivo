import { MessageCircleIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

function WhatsAppFloatingButton() {
  return (
    <a
      href={siteConfig.contact.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar a Espacio ERA por WhatsApp"
      className={cn(
        buttonVariants({ variant: "whatsapp", size: "icon" }),
        "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 size-12 rounded-full shadow-floating sm:right-6 sm:bottom-6 sm:h-10 sm:w-auto sm:rounded-md sm:px-3.5"
      )}
    >
      <MessageCircleIcon className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}

export { WhatsAppFloatingButton }

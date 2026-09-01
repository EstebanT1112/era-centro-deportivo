"use client"

import { CopyIcon, MessageCircleIcon, SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { toast } from "@/components/ui/toast"

function ShareActions({ title }: { title: string }) {
  function shareTo(destination: "whatsapp" | "facebook") {
    const url = window.location.href
    const shareUrl = destination === "whatsapp"
      ? buildWhatsAppUrl("", `${title}\n${url}`)
      : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.add({ title: "Enlace copiado", description: "Ya podés compartir esta noticia.", type: "success" })
    } catch {
      toast.add({ title: "No se pudo copiar el enlace", description: "Copialo desde la barra de direcciones.", type: "error" })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Compartir noticia">
      <span className="mr-1 text-sm font-medium">Compartir:</span>
      <Button variant="outline" size="sm" onClick={() => shareTo("whatsapp")}><MessageCircleIcon data-icon="inline-start" />WhatsApp</Button>
      <Button variant="outline" size="sm" onClick={() => shareTo("facebook")}><SendIcon data-icon="inline-start" />Facebook</Button>
      <Button variant="ghost" size="sm" onClick={copyLink}><CopyIcon data-icon="inline-start" />Copiar enlace</Button>
    </div>
  )
}

export { ShareActions }

import type { Metadata } from "next"

import { FaqSearch } from "@/components/public/faq/faq-search"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { getVisibleFaqs } from "@/lib/mock-selectors"

export const metadata: Metadata = { title: "Preguntas frecuentes", description: "Respuestas sobre reservas, pagos, canchas, horarios y Espacio ERA." }

export default function FrequentlyAskedQuestionsPage() {
  return <><section className="border-b border-border bg-background-subtle py-10 md:py-14"><PageContainer><PageHeader title="Preguntas frecuentes" description="Encontrá rápidamente información sobre turnos, pagos, instalaciones y servicios." className="border-0 pb-0" /></PageContainer></section><section className="py-10 md:py-14"><PageContainer><FaqSearch faqs={getVisibleFaqs()} /></PageContainer></section></>
}

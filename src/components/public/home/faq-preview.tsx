import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Faq } from "@/types"
import { HomeReveal } from "./home-reveal"

function FaqPreview({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) {
    return null
  }

  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <PageContainer className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <HomeReveal className="flex max-w-lg flex-col items-start gap-5">
          <div className="flex flex-col gap-3">
            <p className="type-label text-primary">Preguntas frecuentes</p>
            <h2 className="type-h2 text-foreground">Antes de entrar a la cancha</h2>
            <p className="type-body-lg text-muted-foreground">
              Respuestas rápidas sobre turnos, pagos e instalaciones.
            </p>
          </div>
          <Link
            href="/preguntas-frecuentes"
            className={buttonVariants({ variant: "ghost" })}
          >
            Ver todas las preguntas
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </HomeReveal>
        <HomeReveal delay={0.08}>
          <Accordion className="rounded-lg border border-border bg-surface px-5 shadow-subtle sm:px-6">
            {faqs.slice(0, 5).map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="py-5 font-display text-h4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-pretty text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </HomeReveal>
      </PageContainer>
    </section>
  )
}

export { FaqPreview }

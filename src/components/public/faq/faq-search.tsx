"use client"

import { useMemo, useState } from "react"
import { CircleHelpIcon, SearchIcon, XIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Faq, FaqCategory } from "@/types"

const categoryLabels: Record<FaqCategory, string> = {
  reservas: "Reservas",
  pagos: "Pagos",
  canchas: "Canchas",
  horarios: "Horarios",
  tienda: "Tienda",
  club: "Centro",
}

function FaqSearch({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLocaleLowerCase("es")
  const filteredFaqs = faqs.filter((faq) => !normalizedQuery || `${faq.question} ${faq.answer}`.toLocaleLowerCase("es").includes(normalizedQuery))
  const groupedFaqs = useMemo(() => Object.entries(categoryLabels).map(([category, label]) => ({ category: category as FaqCategory, label, faqs: filteredFaqs.filter((faq) => faq.category === category) })).filter((group) => group.faqs.length), [filteredFaqs])

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-border bg-surface p-5 shadow-subtle sm:p-6">
        <Field>
          <FieldLabel htmlFor="faq-search">Buscar una pregunta</FieldLabel>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="faq-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. seña, horarios o estacionamiento" className="pl-9" /></div>
            {query ? <Button type="button" variant="outline" onClick={() => setQuery("")}><XIcon data-icon="inline-start" />Limpiar búsqueda</Button> : null}
          </div>
          <FieldDescription aria-live="polite">{filteredFaqs.length} {filteredFaqs.length === 1 ? "respuesta encontrada" : "respuestas encontradas"}</FieldDescription>
        </Field>
      </div>

      {groupedFaqs.length ? <div className="grid gap-8 lg:grid-cols-2">{groupedFaqs.map((group) => <section key={group.category} aria-labelledby={`faq-${group.category}`}><h2 id={`faq-${group.category}`} className="mb-3 font-display text-h3">{group.label}</h2><Accordion className="rounded-lg border border-border bg-surface px-5 shadow-subtle">{group.faqs.map((faq) => <AccordionItem key={faq.id} value={faq.id}><AccordionTrigger className="py-5 font-display text-h4 hover:no-underline">{faq.question}</AccordionTrigger><AccordionContent className="pb-5 text-base text-pretty text-muted-foreground"><p>{faq.answer}</p></AccordionContent></AccordionItem>)}</Accordion></section>)}</div> : <EmptyState icon={CircleHelpIcon} titleAs="h2" title="No encontramos esa respuesta" description="Probá con otra palabra o limpiá la búsqueda para ver todas las preguntas." action={<Button variant="outline" onClick={() => setQuery("")}>Ver todas las preguntas</Button>} />}
    </div>
  )
}

export { FaqSearch }

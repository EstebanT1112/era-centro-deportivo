"use client"

import { useMemo, useState } from "react"
import { Edit3Icon, HelpCircleIcon, PlusIcon, SearchIcon, StarIcon, XIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminTableShell } from "@/components/admin/admin-table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { FAQ_CATEGORIES } from "@/constants/domain"
import { sortFaqs } from "@/lib/admin-site-content"
import type { Faq, FaqCategory } from "@/types"
import { useAdminSiteContent } from "./site-content-provider"

const boolOptions = (all: string, yes: string, no: string) => [{ value: "all", label: all }, { value: "yes", label: yes }, { value: "no", label: no }]
const categoryOptions = [{ value: "all", label: "Todas las categorías" }, ...FAQ_CATEGORIES]
type FaqDraft = Omit<Faq, "id">

function FaqEditor({ item, onClose }: { item?: Faq; onClose: () => void }) {
  const { addFaq, updateFaq, faqs } = useAdminSiteContent()
  const [draft, setDraft] = useState<FaqDraft>(item ? { ...item } : { question: "", answer: "", category: "reservas", isVisible: true, isFeatured: false, order: faqs.filter((faq) => faq.category === "reservas").length + 1 })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const setValue = <K extends keyof FaqDraft>(key: K, value: FaqDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const save = () => {
    const next: Record<string, string> = {}
    if (!draft.question.trim()) next.question = "Ingresá la pregunta."
    if (!draft.answer.trim()) next.answer = "Ingresá la respuesta."
    if (!draft.category) next.category = "Seleccioná una categoría."
    if (!(draft.order > 0)) next.order = "El orden debe ser mayor que cero."
    setErrors(next)
    if (Object.keys(next).length) return
    const normalized = { ...draft, question: draft.question.trim(), answer: draft.answer.trim() }
    if (item) updateFaq(item.id, normalized); else addFaq(normalized)
    toast.add({ title: item ? "Pregunta actualizada" : "Pregunta creada", description: "Los cambios se guardaron en el estado local.", type: "success" })
    onClose()
  }
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{item ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle><DialogDescription>Definí el contenido y dónde se muestra dentro del sitio.</DialogDescription></DialogHeader><FieldGroup>
    <Field data-invalid={!!errors.question}><FieldLabel htmlFor="faq-question">Pregunta</FieldLabel><Input id="faq-question" value={draft.question} onChange={(event) => setValue("question", event.target.value)} aria-invalid={!!errors.question} aria-describedby={errors.question ? "faq-question-error" : undefined} />{errors.question ? <FieldError id="faq-question-error">{errors.question}</FieldError> : null}</Field>
    <Field data-invalid={!!errors.answer}><FieldLabel htmlFor="faq-answer">Respuesta</FieldLabel><Textarea id="faq-answer" value={draft.answer} onChange={(event) => setValue("answer", event.target.value)} rows={5} aria-invalid={!!errors.answer} aria-describedby={errors.answer ? "faq-answer-error" : undefined} />{errors.answer ? <FieldError id="faq-answer-error">{errors.answer}</FieldError> : null}</Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="faq-category">Categoría</FieldLabel><Select items={FAQ_CATEGORIES} value={draft.category} onValueChange={(value) => value && setValue("category", value as FaqCategory)}><SelectTrigger id="faq-category"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{FAQ_CATEGORIES.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field><Field data-invalid={!!errors.order}><FieldLabel htmlFor="faq-order">Orden en la categoría</FieldLabel><Input id="faq-order" type="number" min={1} value={draft.order} onChange={(event) => setValue("order", Number(event.target.value))} aria-invalid={!!errors.order} />{errors.order ? <FieldError>{errors.order}</FieldError> : null}</Field></div>
    <Field orientation="horizontal"><Switch id="faq-visible" checked={draft.isVisible} onCheckedChange={(checked) => setValue("isVisible", checked)} /><FieldContent><FieldLabel htmlFor="faq-visible">Visible en el sitio</FieldLabel><FieldDescription>Controla su aparición en la página pública de preguntas.</FieldDescription></FieldContent></Field>
    <Field orientation="horizontal"><Switch id="faq-featured" checked={draft.isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} /><FieldContent><FieldLabel htmlFor="faq-featured">Destacada en la Home</FieldLabel><FieldDescription>Solo se muestra si también está visible.</FieldDescription></FieldContent></Field>
  </FieldGroup><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Guardar pregunta</Button></DialogFooter></DialogContent></Dialog>
}

function FaqManager() {
  const { faqs } = useAdminSiteContent()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [visible, setVisible] = useState("all")
  const [featured, setFeatured] = useState("all")
  const [editing, setEditing] = useState<Faq | "new" | null>(null)
  const normalized = search.trim().toLocaleLowerCase("es")
  const filtered = useMemo(() => sortFaqs(faqs).filter((faq) => (!normalized || `${faq.question} ${faq.answer}`.toLocaleLowerCase("es").includes(normalized)) && (category === "all" || faq.category === category) && (visible === "all" || faq.isVisible === (visible === "yes")) && (featured === "all" || faq.isFeatured === (featured === "yes"))), [category, faqs, featured, normalized, visible])
  const hasFilters = !!normalized || category !== "all" || visible !== "all" || featured !== "all"
  const clear = () => { setSearch(""); setCategory("all"); setVisible("all"); setFeatured("all") }
  const select = (items: { value: string; label: string }[], value: string, setter: (value: string) => void, label: string) => <Select items={items} value={value} onValueChange={(next) => next && setter(next)}><SelectTrigger aria-label={label} className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
  const mobile = <div className="grid gap-3 p-3">{filtered.map((faq) => <Card key={faq.id} size="sm"><CardContent className="flex flex-col gap-3"><div><p className="font-semibold text-balance">{faq.question}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{faq.answer}</p></div><div className="flex flex-wrap gap-1.5"><StatusBadge variant={faq.isVisible ? "success" : "neutral"}>{faq.isVisible ? "Visible" : "Oculta"}</StatusBadge>{faq.isFeatured ? <StatusBadge variant="info" icon={StarIcon}>Destacada</StatusBadge> : null}</div><Button variant="outline" size="sm" onClick={() => setEditing(faq)}><Edit3Icon data-icon="inline-start" aria-hidden="true" />Editar</Button></CardContent></Card>)}</div>
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Preguntas frecuentes" description="Gestioná respuestas, categorías y su presencia en el sitio público." actions={<Button onClick={() => setEditing("new")}><PlusIcon data-icon="inline-start" aria-hidden="true" />Nueva pregunta</Button>} />
    <AdminFilterBar search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar preguntas" aria-label="Buscar en preguntas y respuestas" className="pl-9" /></div>} filters={<>{select(categoryOptions, category, setCategory, "Filtrar por categoría")}{select(boolOptions("Visibles u ocultas", "Visibles", "Ocultas"), visible, setVisible, "Filtrar por visibilidad")}{select(boolOptions("Destacadas o no", "Destacadas", "No destacadas"), featured, setFeatured, "Filtrar preguntas destacadas")}</>} resultCount={<span aria-live="polite">{filtered.length} {filtered.length === 1 ? "pregunta" : "preguntas"}</span>} clearAction={hasFilters ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null} />
    {filtered.length ? <AdminTableShell title="Preguntas publicables" description="El orden se aplica dentro de cada categoría." mobileFallback={mobile}><Table><TableHeader><TableRow><TableHead>Pregunta</TableHead><TableHead>Categoría</TableHead><TableHead>Orden</TableHead><TableHead>Visible</TableHead><TableHead>Destacada</TableHead><TableHead><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((faq) => <TableRow key={faq.id}><TableCell className="max-w-lg"><p className="font-medium text-balance">{faq.question}</p><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{faq.answer}</p></TableCell><TableCell>{FAQ_CATEGORIES.find((option) => option.value === faq.category)?.label}</TableCell><TableCell>{faq.order}</TableCell><TableCell><StatusBadge variant={faq.isVisible ? "success" : "neutral"}>{faq.isVisible ? "Visible" : "Oculta"}</StatusBadge></TableCell><TableCell>{faq.isFeatured ? <span className="inline-flex gap-1.5"><StarIcon className="size-4" aria-hidden="true" />Sí</span> : "No"}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => setEditing(faq)}><Edit3Icon data-icon="inline-start" aria-hidden="true" />Editar</Button></TableCell></TableRow>)}</TableBody></Table></AdminTableShell> : <EmptyState icon={HelpCircleIcon} title="No hay preguntas con estos filtros" description="Probá otra búsqueda o limpiá los filtros activos." action={<Button variant="outline" onClick={clear}>Limpiar filtros</Button>} />}
    {editing ? <FaqEditor key={editing === "new" ? "new" : editing.id} item={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} /> : null}
  </div>
}

export { FaqManager }

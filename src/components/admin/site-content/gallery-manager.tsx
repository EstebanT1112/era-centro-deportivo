"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ArrowDownIcon, ArrowUpIcon, Edit3Icon, ImagePlusIcon, ImagesIcon, SearchIcon, StarIcon, XIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"

import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { GALLERY_CATEGORIES } from "@/constants/domain"
import { CONTENT_IMAGE_OPTIONS } from "@/lib/admin-content"
import { sortGalleryItems } from "@/lib/admin-site-content"
import type { GalleryCategory, GalleryItem } from "@/types"
import { useAdminSiteContent } from "./site-content-provider"

const booleanOptions = (all: string, yes: string, no: string) => [{ value: "all", label: all }, { value: "yes", label: yes }, { value: "no", label: no }]
const categoryOptions = [{ value: "all", label: "Todas las categorías" }, ...GALLERY_CATEGORIES]
type GalleryDraft = Omit<GalleryItem, "id">

function GalleryEditor({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const { updateGalleryItem } = useAdminSiteContent()
  const [draft, setDraft] = useState<GalleryDraft>({ ...item })
  const [error, setError] = useState("")
  const setValue = <K extends keyof GalleryDraft>(key: K, value: GalleryDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const save = () => {
    if (!draft.title?.trim()) { setError("Ingresá un título para identificar la imagen."); return }
    if (!(draft.order > 0)) { setError("El orden debe ser mayor que cero."); return }
    updateGalleryItem(item.id, { ...draft, title: draft.title.trim(), description: draft.description?.trim() })
    toast.add({ title: "Imagen actualizada", description: "Los cambios se guardaron en el estado local.", type: "success" })
    onClose()
  }
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>Editar imagen</DialogTitle><DialogDescription>Ajustá la información, visibilidad y posición dentro de la galería.</DialogDescription></DialogHeader><FieldGroup>
    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted"><Image src={draft.imageUrl} alt="Vista previa de la imagen seleccionada" fill sizes="560px" className="object-cover" /></div>
    <Field><FieldLabel htmlFor="gallery-title">Título</FieldLabel><Input id="gallery-title" value={draft.title ?? ""} onChange={(event) => setValue("title", event.target.value)} aria-invalid={!!error && !draft.title?.trim()} /></Field>
    <Field><FieldLabel htmlFor="gallery-description">Descripción</FieldLabel><Textarea id="gallery-description" value={draft.description ?? ""} onChange={(event) => setValue("description", event.target.value)} rows={3} /></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="gallery-category">Categoría</FieldLabel><Select items={GALLERY_CATEGORIES} value={draft.category} onValueChange={(value) => value && setValue("category", value as GalleryCategory)}><SelectTrigger id="gallery-category"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{GALLERY_CATEGORIES.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field><Field><FieldLabel htmlFor="gallery-order">Orden</FieldLabel><Input id="gallery-order" type="number" min={1} value={draft.order} onChange={(event) => setValue("order", Number(event.target.value))} aria-invalid={!!error && !(draft.order > 0)} /></Field></div>
    <Field orientation="horizontal"><Switch id="gallery-visible" checked={draft.isVisible} onCheckedChange={(checked) => setValue("isVisible", checked)} /><FieldContent><FieldLabel htmlFor="gallery-visible">Visible en el sitio</FieldLabel><FieldDescription>Las imágenes ocultas no aparecen en la galería pública.</FieldDescription></FieldContent></Field>
    <Field orientation="horizontal"><Switch id="gallery-featured" checked={draft.isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} /><FieldContent><FieldLabel htmlFor="gallery-featured">Destacada</FieldLabel><FieldDescription>Puede mostrarse en la selección de la Home si también está visible.</FieldDescription></FieldContent></Field>
    {error ? <FieldError role="alert">{error}</FieldError> : null}
  </FieldGroup><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Guardar cambios</Button></DialogFooter></DialogContent></Dialog>
}

function GalleryManager() {
  const { galleryItems, addGalleryItem, moveGalleryItem } = useAdminSiteContent()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [visible, setVisible] = useState("all")
  const [featured, setFeatured] = useState("all")
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const normalized = search.trim().toLocaleLowerCase("es")
  const filtered = useMemo(() => sortGalleryItems(galleryItems).filter((item) => (!normalized || `${item.title ?? ""} ${item.description ?? ""}`.toLocaleLowerCase("es").includes(normalized)) && (category === "all" || item.category === category) && (visible === "all" || item.isVisible === (visible === "yes")) && (featured === "all" || item.isFeatured === (featured === "yes"))), [category, featured, galleryItems, normalized, visible])
  const hasFilters = !!normalized || category !== "all" || visible !== "all" || featured !== "all"
  const clear = () => { setSearch(""); setCategory("all"); setVisible("all"); setFeatured("all") }
  const select = (items: { value: string; label: string }[], value: string, setter: (value: string) => void, label: string) => <Select items={items} value={value} onValueChange={(next) => next && setter(next)}><SelectTrigger aria-label={label} className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
  const addImage = () => {
    const imageUrl = CONTENT_IMAGE_OPTIONS.find((src) => !galleryItems.some((item) => item.imageUrl === src)) ?? CONTENT_IMAGE_OPTIONS[galleryItems.length % CONTENT_IMAGE_OPTIONS.length]
    const created = addGalleryItem({ imageUrl, category: "club", title: `Nueva imagen ${galleryItems.length + 1}`, description: "Imagen de muestra lista para editar.", isFeatured: false, isVisible: false, order: galleryItems.length + 1 })
    toast.add({ title: "Imagen de muestra agregada", description: "Editala antes de hacerla visible.", type: "success" })
    setEditing(created)
  }

  return <div className="flex flex-col gap-5"><AdminPageHeader title="Galería" description="Organizá las imágenes, su categoría y qué contenido se publica en el sitio." actions={<Button onClick={addImage}><ImagePlusIcon data-icon="inline-start" aria-hidden="true" />Subir imágenes</Button>} />
    <AdminFilterBar search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar imágenes" aria-label="Buscar por título o descripción" className="pl-9" /></div>} filters={<>{select(categoryOptions, category, setCategory, "Filtrar por categoría")}{select(booleanOptions("Visibles u ocultas", "Visibles", "Ocultas"), visible, setVisible, "Filtrar por visibilidad")}{select(booleanOptions("Destacadas o no", "Destacadas", "No destacadas"), featured, setFeatured, "Filtrar imágenes destacadas")}</>} resultCount={<span aria-live="polite">{filtered.length} {filtered.length === 1 ? "imagen" : "imágenes"}</span>} clearAction={hasFilters ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null} />
    {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => { const ordered = sortGalleryItems(galleryItems); const index = ordered.findIndex((current) => current.id === item.id); return <Card key={item.id} className="overflow-hidden"><div className="relative aspect-[4/3] bg-muted"><Image src={item.imageUrl} alt={item.title ?? "Imagen de la galería"} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /><div className="absolute top-3 left-3 flex flex-wrap gap-1.5"><StatusBadge variant={item.isVisible ? "success" : "neutral"}>{item.isVisible ? "Visible" : "Oculta"}</StatusBadge>{item.isFeatured ? <StatusBadge variant="info" icon={StarIcon}>Destacada</StatusBadge> : null}</div></div><CardContent className="flex flex-col gap-4 p-4"><div><p className="font-semibold text-balance">{item.title ?? "Sin título"}</p><p className="mt-1 text-sm text-muted-foreground">{GALLERY_CATEGORIES.find((categoryItem) => categoryItem.value === item.category)?.label} · Orden {item.order}</p></div><div className="flex items-center justify-between gap-2"><div className="flex gap-1"><Button variant="ghost" size="icon-sm" aria-label={`Mover ${item.title} hacia arriba`} disabled={index === 0} onClick={() => moveGalleryItem(item.id, -1)}><ArrowUpIcon aria-hidden="true" /></Button><Button variant="ghost" size="icon-sm" aria-label={`Mover ${item.title} hacia abajo`} disabled={index === ordered.length - 1} onClick={() => moveGalleryItem(item.id, 1)}><ArrowDownIcon aria-hidden="true" /></Button></div><Button variant="outline" size="sm" onClick={() => setEditing(item)}><Edit3Icon data-icon="inline-start" aria-hidden="true" />Editar</Button></div></CardContent></Card>})}</div> : <EmptyState icon={ImagesIcon} title="No hay imágenes con estos filtros" description="Probá otra búsqueda o limpiá los filtros activos." action={<Button variant="outline" onClick={clear}>Limpiar filtros</Button>} />}
    {editing ? <GalleryEditor key={editing.id} item={galleryItems.find((item) => item.id === editing.id) ?? editing} onClose={() => setEditing(null)} /> : null}
  </div>
}

export { GalleryManager }

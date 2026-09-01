"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon, SaveIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { FormSection } from "@/components/admin/admin-form"
import { useAdminContent } from "@/components/admin/content/content-provider"
import { CoverImageManager, ProductImageManager } from "@/components/admin/content/content-image-manager"
import { useAdminCourts } from "@/components/admin/courts/courts-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cloneSiteContent } from "@/lib/admin-site-content"
import type { SiteContent } from "@/types"
import { useAdminSiteContent } from "./site-content-provider"

const MAX_FEATURED = 4

function SelectionList({ items, selected, onChange, label }: { items: { id: string; title: string; description?: string }[]; selected: string[]; onChange: (ids: string[]) => void; label: string }) {
  const toggle = (id: string, checked: boolean) => {
    if (checked && selected.length >= MAX_FEATURED) { toast.add({ title: `Podés destacar hasta ${MAX_FEATURED} elementos.`, type: "error" }); return }
    onChange(checked ? [...selected, id] : selected.filter((item) => item !== id))
  }
  return <fieldset className="flex flex-col gap-3"><legend className="sr-only">{label}</legend><p className="text-sm text-muted-foreground" aria-live="polite">{selected.length} de {MAX_FEATURED} seleccionados</p><div className="grid gap-2 sm:grid-cols-2">{items.map((item) => { const id = `${label}-${item.id}`; return <label key={item.id} htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-muted/60"><Checkbox id={id} checked={selected.includes(item.id)} onCheckedChange={(checked) => toggle(item.id, checked)} /><span className="min-w-0"><span className="block font-medium">{item.title}</span>{item.description ? <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span> : null}</span></label>})}</div></fieldset>
}

function InstitutionalContentEditor() {
  const { siteContent, updateSiteContent } = useAdminSiteContent()
  const { courts, setFeaturedCourts } = useAdminCourts()
  const { products, setFeaturedProducts } = useAdminContent()
  const [draft, setDraft] = useState<SiteContent>(() => cloneSiteContent(siteContent))
  const [courtIds, setCourtIds] = useState(() => courts.filter((court) => court.isFeatured).map((court) => court.id).slice(0, MAX_FEATURED))
  const [productIds, setProductIds] = useState(() => products.filter((product) => product.isFeatured && product.isVisible).map((product) => product.id).slice(0, MAX_FEATURED))
  const [homeError, setHomeError] = useState("")
  const [clubError, setClubError] = useState("")
  const setHome = <K extends keyof SiteContent["home"]>(key: K, value: SiteContent["home"][K]) => setDraft((current) => ({ ...current, home: { ...current.home, [key]: value } }))
  const setClub = <K extends keyof SiteContent["club"]>(key: K, value: SiteContent["club"][K]) => setDraft((current) => ({ ...current, club: { ...current.club, [key]: value } }))
  const saveHome = () => {
    if (!draft.home.heroTitle.trim() || !draft.home.heroDescription.trim() || !draft.home.heroImage) { setHomeError("Completá el título, la descripción y la imagen del Hero."); return }
    setHomeError(""); updateSiteContent(draft); setFeaturedCourts(courtIds); setFeaturedProducts(productIds); toast.add({ title: "Contenido de Inicio guardado", description: "Los cambios se mantienen en esta sesión.", type: "success" })
  }
  const saveClub = () => {
    if (!draft.club.introTitle.trim() || !draft.club.introText.trim() || !draft.club.history.trim() || !draft.club.images.length) { setClubError("Completá la presentación, la historia y al menos una imagen."); return }
    setClubError(""); updateSiteContent(draft); toast.add({ title: "Contenido de Club guardado", description: "Los cambios se mantienen en esta sesión.", type: "success" })
  }
  const updateService = (id: string, key: "title" | "description", value: string) => setDraft((current) => ({ ...current, services: current.services.map((service) => service.id === id ? { ...service, [key]: value } : service) }))
  const toggleService = (id: string, checked: boolean) => setClub("serviceIds", checked ? [...draft.club.serviceIds, id] : draft.club.serviceIds.filter((item) => item !== id))
  const moveService = (id: string, direction: -1 | 1) => { const ids = [...draft.club.serviceIds]; const index = ids.indexOf(id); const target = index + direction; if (index < 0 || target < 0 || target >= ids.length) return; [ids[index], ids[target]] = [ids[target], ids[index]]; setClub("serviceIds", ids) }
  const orderedServices = [...draft.club.serviceIds.map((id) => draft.services.find((service) => service.id === id)).filter(Boolean), ...draft.services.filter((service) => !draft.club.serviceIds.includes(service.id))] as SiteContent["services"]

  return <div className="flex flex-col gap-5"><AdminPageHeader title="Contenido institucional" description="Editá la presentación principal de Inicio y Club sin mezclar configuración operativa." actions={<div className="flex gap-2"><Button variant="outline" size="sm" render={<Link href="/" target="_blank" />} nativeButton={false}>Ver Inicio<ExternalLinkIcon data-icon="inline-end" aria-hidden="true" /></Button><Button variant="outline" size="sm" render={<Link href="/club" target="_blank" />} nativeButton={false}>Ver Club<ExternalLinkIcon data-icon="inline-end" aria-hidden="true" /></Button></div>} />
    <Tabs defaultValue="home"><TabsList variant="line" aria-label="Secciones de contenido"><TabsTrigger value="home">Inicio</TabsTrigger><TabsTrigger value="club">Club</TabsTrigger></TabsList>
      <TabsContent value="home" className="pt-5"><div className="grid gap-5 xl:grid-cols-2"><FormSection title="Hero de Inicio" description="Contenido principal que presenta al club y conduce a la reserva."><FieldGroup><Field><FieldLabel htmlFor="home-hero-title">Título</FieldLabel><Input id="home-hero-title" value={draft.home.heroTitle} onChange={(event) => setHome("heroTitle", event.target.value)} /></Field><Field><FieldLabel htmlFor="home-hero-description">Descripción</FieldLabel><Textarea id="home-hero-description" value={draft.home.heroDescription} onChange={(event) => setHome("heroDescription", event.target.value)} rows={4} /></Field><Field><FieldLabel>Imagen principal</FieldLabel><CoverImageManager value={draft.home.heroImage} label="Inicio" onChange={(value) => setHome("heroImage", value)} /></Field></FieldGroup></FormSection>
        <div className="flex flex-col gap-5"><FormSection title="Canchas destacadas" description="Esta selección actualiza el campo isFeatured de cada cancha."><SelectionList label="Cancha destacada" selected={courtIds} onChange={setCourtIds} items={courts.map((court) => ({ id: court.id, title: court.name, description: court.type }))} /></FormSection><FormSection title="Productos destacados" description="Solo se pueden seleccionar productos visibles."><SelectionList label="Producto destacado" selected={productIds} onChange={setProductIds} items={products.filter((product) => product.isVisible).map((product) => ({ id: product.id, title: product.name, description: product.category }))} /></FormSection></div></div>{homeError ? <FieldError className="mt-4" role="alert">{homeError}</FieldError> : null}<div className="mt-5 flex justify-end"><Button onClick={saveHome}><SaveIcon data-icon="inline-start" aria-hidden="true" />Guardar Inicio</Button></div></TabsContent>
      <TabsContent value="club" className="pt-5"><div className="grid gap-5 xl:grid-cols-2"><FormSection title="Presentación e historia" description="Texto institucional que alimenta la página pública del club."><FieldGroup><Field><FieldLabel htmlFor="club-title">Título</FieldLabel><Input id="club-title" value={draft.club.introTitle} onChange={(event) => setClub("introTitle", event.target.value)} /></Field><Field><FieldLabel htmlFor="club-intro">Introducción</FieldLabel><Textarea id="club-intro" value={draft.club.introText} onChange={(event) => setClub("introText", event.target.value)} rows={4} /></Field><Field><FieldLabel htmlFor="club-history">Historia</FieldLabel><Textarea id="club-history" value={draft.club.history} onChange={(event) => setClub("history", event.target.value)} rows={10} /><FieldDescription>Separá los momentos de la historia con una línea en blanco.</FieldDescription></Field></FieldGroup></FormSection><FormSection title="Imágenes institucionales" description="Ordená las imágenes que forman la composición visual de Club."><ProductImageManager images={draft.club.images} label="el club" onChange={(images) => setClub("images", images)} /></FormSection></div>
        <FormSection title="Servicios del club" description="Editá, activá y ordená los servicios mostrados públicamente." className="mt-5"><div className="grid gap-3 lg:grid-cols-2">{orderedServices.map((service) => { const selected = draft.club.serviceIds.includes(service.id); const index = draft.club.serviceIds.indexOf(service.id); return <div key={service.id} className="flex gap-3 rounded-lg border border-border bg-surface p-3"><Checkbox id={`club-service-${service.id}`} checked={selected} onCheckedChange={(checked) => toggleService(service.id, checked)} aria-label={`Mostrar ${service.title}`} /><div className="min-w-0 flex-1 space-y-2"><Input aria-label={`Nombre de ${service.title}`} value={service.title} onChange={(event) => updateService(service.id, "title", event.target.value)} /><Textarea aria-label={`Descripción de ${service.title}`} value={service.description} onChange={(event) => updateService(service.id, "description", event.target.value)} rows={2} /></div><div className="flex flex-col gap-1"><Button variant="ghost" size="icon-sm" aria-label={`Mover ${service.title} hacia arriba`} disabled={!selected || index === 0} onClick={() => moveService(service.id, -1)}><ArrowUpIcon aria-hidden="true" /></Button><Button variant="ghost" size="icon-sm" aria-label={`Mover ${service.title} hacia abajo`} disabled={!selected || index === draft.club.serviceIds.length - 1} onClick={() => moveService(service.id, 1)}><ArrowDownIcon aria-hidden="true" /></Button></div></div>})}</div></FormSection>{clubError ? <FieldError className="mt-4" role="alert">{clubError}</FieldError> : null}<div className="mt-5 flex justify-end"><Button onClick={saveClub}><SaveIcon data-icon="inline-start" aria-hidden="true" />Guardar Club</Button></div></TabsContent>
    </Tabs>
  </div>
}

export { InstitutionalContentEditor }

"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, ExternalLinkIcon, NewspaperIcon, SaveIcon } from "lucide-react";

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { POST_CATEGORIES } from "@/constants/domain";
import { clonePost, createEmptyPost, slugify, validatePost, type PostDraft } from "@/lib/admin-content";
import type { PostStatus } from "@/types";
import { CoverImageManager } from "./content-image-manager";
import { useAdminContent } from "./content-provider";
import { PostBlockEditor } from "./post-block-editor";

const categoryItems = POST_CATEGORIES.map((value) => ({ value, label: value }));
const statusItems = [{ value: "draft", label: "Borrador" }, { value: "published", label: "Publicada" }];

function PostForm({ postId }: { postId: string }) {
  const router = useRouter();
  const { posts, addPost, updatePost } = useAdminContent();
  const isNew = postId === "nueva";
  const existing = posts.find((post) => post.id === postId);
  const [draft, setDraft] = useState<PostDraft>(() => isNew ? createEmptyPost() : existing ? clonePost(existing) : createEmptyPost());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  if (!isNew && !existing) return <EmptyState icon={NewspaperIcon} titleAs="h1" title="Noticia no encontrada" description="El identificador no corresponde a una noticia disponible en esta sesión." action={<Button render={<Link href="/admin/noticias" />} nativeButton={false}>Volver a noticias</Button>} />;
  const setValue = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const setTitle = (title: string) => setDraft((current) => ({ ...current, title, slug: slugEdited ? current.slug : slugify(title) }));
  const setStatus = (status: PostStatus) => setDraft((current) => ({ ...current, status, publishedAt: status === "published" ? (current.publishedAt || "2026-08-22") : undefined }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validatePost(draft); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { document.getElementById("post-form-errors")?.focus(); return; }
    setSaving(true); const saved = isNew ? addPost(draft) : updatePost(postId, draft); setSaving(false); if (!saved) return;
    toast.add({ title: isNew ? "Noticia creada correctamente" : "Noticia actualizada correctamente", description: `${saved.title} · cambios guardados en estado local.`, type: "success" });
    if (isNew) router.replace(`/admin/noticias/${saved.id}`);
  }

  return <div className="flex flex-col gap-5">
    <AdminPageHeader title={isNew ? "Crear noticia" : "Editar noticia"} description={isNew ? "Prepará una publicación y decidí cuándo mostrarla." : existing!.title} breadcrumbs={[{ label: "Noticias", href: "/admin/noticias" }, { label: isNew ? "Nueva" : existing!.title }]} actions={<>{!isNew && draft.status === "published" ? <Button variant="outline" render={<Link href={`/noticias/${draft.slug}`} />} nativeButton={false}><ExternalLinkIcon data-icon="inline-start" aria-hidden="true" />Ver en sitio</Button> : null}<Dialog><DialogTrigger render={<Button variant="outline" />}><EyeIcon data-icon="inline-start" aria-hidden="true" />Vista previa</DialogTrigger><DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>Vista previa de noticia</DialogTitle><DialogDescription>Representación local antes de guardar o publicar.</DialogDescription></DialogHeader><article className="flex flex-col gap-5"><div className="flex flex-wrap gap-2"><Badge variant="outline">{draft.category || "Sin categoría"}</Badge><Badge variant={draft.status === "published" ? "success" : "secondary"}>{draft.status === "published" ? "Publicada" : "Borrador"}</Badge></div><h2 className="font-display text-h1 text-balance">{draft.title || "Título de la noticia"}</h2><p className="text-pretty text-muted-foreground">{draft.excerpt || "El resumen aparecerá aquí."}</p>{draft.coverImage ? <div className="relative aspect-[16/8] overflow-hidden rounded-lg bg-muted"><Image src={draft.coverImage} alt="" fill sizes="700px" className="object-cover" /></div> : null}<div className="flex flex-col gap-4">{draft.content.map((block, index) => block.type === "heading" ? <h3 key={index} className="font-display text-h3 text-balance">{block.text || "Subtítulo"}</h3> : block.type === "paragraph" ? <p key={index} className="text-pretty">{block.text || "Párrafo sin contenido"}</p> : <div key={index} className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted"><Image src={block.src} alt={block.alt} fill sizes="700px" className="object-cover" /></div>)}</div></article></DialogContent></Dialog><Button type="submit" form="post-form" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando…" : isNew ? "Crear noticia" : "Guardar cambios"}</Button></>} />
    <form id="post-form" onSubmit={submit} noValidate className="grid gap-4 xl:grid-cols-12">
      <div className="flex flex-col gap-4 xl:col-span-8">{Object.keys(errors).length ? <div id="post-form-errors" role="alert" tabIndex={-1} className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><p className="font-semibold">Revisá los campos indicados.</p><p className="mt-1">Hay {Object.keys(errors).length} datos pendientes antes de guardar.</p></div> : null}
        <FormSection title="Información" description="Título, URL y resumen utilizados en Home y Noticias."><FieldGroup><FormGrid><Field data-invalid={!!errors.title}><FieldLabel htmlFor="post-title">Título</FieldLabel><Input id="post-title" required value={draft.title} onChange={(event) => setTitle(event.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? "post-title-error" : undefined} />{errors.title ? <FieldError id="post-title-error">{errors.title}</FieldError> : null}</Field><Field data-invalid={!!errors.slug}><FieldLabel htmlFor="post-slug">Slug</FieldLabel><Input id="post-slug" required value={draft.slug} onChange={(event) => { setSlugEdited(true); setValue("slug", slugify(event.target.value)); }} aria-invalid={!!errors.slug} aria-describedby={errors.slug ? "post-slug-error" : "post-slug-help"} /><FieldDescription id="post-slug-help">/noticias/{draft.slug || "slug-de-noticia"}</FieldDescription>{errors.slug ? <FieldError id="post-slug-error">{errors.slug}</FieldError> : null}</Field><Field className="md:col-span-2" data-invalid={!!errors.excerpt}><FieldLabel htmlFor="post-excerpt">Resumen</FieldLabel><Textarea id="post-excerpt" required value={draft.excerpt} onChange={(event) => setValue("excerpt", event.target.value)} aria-invalid={!!errors.excerpt} aria-describedby={errors.excerpt ? "post-excerpt-error" : "post-excerpt-help"} /><FieldDescription id="post-excerpt-help">Se utiliza en Home, listados y noticias relacionadas.</FieldDescription>{errors.excerpt ? <FieldError id="post-excerpt-error">{errors.excerpt}</FieldError> : null}</Field></FormGrid></FieldGroup></FormSection>
        <FormSection title="Contenido" description="Editor seguro por bloques, sin HTML arbitrario ni dependencias externas."><PostBlockEditor blocks={draft.content} onChange={(content) => setValue("content", content)} />{errors.content ? <FieldError className="mt-3">{errors.content}</FieldError> : null}</FormSection>
        <FormSection title="Imagen de portada" description="Vista previa y reemplazo con recursos mock del proyecto."><CoverImageManager value={draft.coverImage} label={draft.title} onChange={(coverImage) => setValue("coverImage", coverImage)} />{errors.coverImage ? <FieldError className="mt-3">{errors.coverImage}</FieldError> : null}</FormSection>
      </div>
      <div className="flex flex-col gap-4 xl:col-span-4"><FormSection title="Publicación" description="Controlá estado, categoría y presencia en destacados."><FieldGroup><Field data-invalid={!!errors.category}><FieldLabel htmlFor="post-category">Categoría</FieldLabel><Select items={categoryItems} value={draft.category || null} onValueChange={(value) => value && setValue("category", value)}><SelectTrigger id="post-category" aria-invalid={!!errors.category}><SelectValue>{(value) => value || "Seleccionar categoría"}</SelectValue></SelectTrigger><SelectContent><SelectGroup>{categoryItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>{errors.category ? <FieldError>{errors.category}</FieldError> : null}</Field><Field><FieldLabel htmlFor="post-status">Estado</FieldLabel><Select items={statusItems} value={draft.status} onValueChange={(value) => value && setStatus(value as PostStatus)}><SelectTrigger id="post-status"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><FieldDescription>{draft.status === "published" ? `Publicación: ${draft.publishedAt}` : "No aparece en el sitio público."}</FieldDescription></Field><Field orientation="horizontal"><Switch id="post-featured" checked={draft.isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} /><FieldContent><FieldLabel htmlFor="post-featured">Destacada</FieldLabel><FieldDescription>Permite mostrarla en selecciones de Home.</FieldDescription></FieldContent></Field></FieldGroup></FormSection></div>
      <div className="xl:col-span-12"><FormActions><Button variant="outline" render={<Link href="/admin/noticias" />} nativeButton={false}>Volver</Button><Button type="submit" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando…" : isNew ? "Crear noticia" : "Guardar cambios"}</Button></FormActions></div>
    </form>
  </div>;
}

export { PostForm };

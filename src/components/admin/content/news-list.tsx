"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Edit3Icon, ExternalLinkIcon, NewspaperIcon, PlusIcon, SearchIcon, StarIcon, XIcon } from "lucide-react";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminRowActions, AdminTableShell } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POST_CATEGORIES } from "@/constants/domain";
import { formatDate } from "@/lib/formatters";
import { useAdminContent } from "./content-provider";

const statusItems = [{ value: "all", label: "Todos los estados" }, { value: "draft", label: "Borrador" }, { value: "published", label: "Publicada" }];
const categoryItems = [{ value: "all", label: "Todas las categorías" }, ...POST_CATEGORIES.map((value) => ({ value, label: value }))];
const featuredItems = [{ value: "all", label: "Destacada o no" }, { value: "yes", label: "Destacadas" }, { value: "no", label: "No destacadas" }];

function PostActions({ id, slug, published }: { id: string; slug: string; published: boolean }) {
  return <AdminRowActions label="Abrir acciones de noticia"><DropdownMenuItem render={<Link href={`/admin/noticias/${id}`} />}><Edit3Icon aria-hidden="true" />Editar</DropdownMenuItem>{published ? <DropdownMenuItem render={<Link href={`/noticias/${slug}`} />}><ExternalLinkIcon aria-hidden="true" />Ver en sitio</DropdownMenuItem> : <DropdownMenuItem disabled><ExternalLinkIcon aria-hidden="true" />No publicada</DropdownMenuItem>}</AdminRowActions>;
}

function NewsList() {
  const { posts } = useAdminContent();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [featured, setFeatured] = useState("all");
  const normalized = search.trim().toLocaleLowerCase("es");
  const filtered = useMemo(() => posts.filter((post) => {
    const matchesSearch = !normalized || `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase("es").includes(normalized);
    return matchesSearch && (status === "all" || post.status === status) && (category === "all" || post.category === category) && (featured === "all" || post.isFeatured === (featured === "yes"));
  }), [category, featured, normalized, posts, status]);
  const hasFilters = !!normalized || status !== "all" || category !== "all" || featured !== "all";
  const clear = () => { setSearch(""); setStatus("all"); setCategory("all"); setFeatured("all"); };

  return <div className="flex flex-col gap-5">
    <AdminPageHeader title="Noticias" description="Creá, editá y publicá novedades que alimentan el sitio público." actions={<Button render={<Link href="/admin/noticias/nueva" />} nativeButton={false}><PlusIcon data-icon="inline-start" aria-hidden="true" />Crear noticia</Button>} />
    <AdminFilterBar
      search={<div className="relative"><SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar noticias" aria-label="Buscar por título, resumen o categoría" className="pl-9" /></div>}
      filters={<><Select items={statusItems} value={status} onValueChange={(value) => value && setStatus(value)}><SelectTrigger aria-label="Filtrar noticias por estado" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><Select items={categoryItems} value={category} onValueChange={(value) => value && setCategory(value)}><SelectTrigger aria-label="Filtrar noticias por categoría" className="sm:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{categoryItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><Select items={featuredItems} value={featured} onValueChange={(value) => value && setFeatured(value)}><SelectTrigger aria-label="Filtrar noticias destacadas" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{featuredItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></>}
      resultCount={<span aria-live="polite">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</span>}
      clearAction={hasFilters ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null}
    />
    {filtered.length ? <AdminTableShell title="Contenido editorial" description="Los borradores no tienen enlace público." mobileFallback={<div className="grid gap-3 p-3">{filtered.map((post) => <Card key={post.id} size="sm"><CardContent className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{post.title}</p><p className="mt-1 text-sm text-muted-foreground">{post.category} · {post.publishedAt ? formatDate(post.publishedAt) : "Sin publicar"}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge variant={post.status === "published" ? "success" : "neutral"}>{post.status === "published" ? "Publicada" : "Borrador"}</StatusBadge>{post.isFeatured ? <StatusBadge variant="info" icon={StarIcon}>Destacada</StatusBadge> : null}</div></div><PostActions id={post.id} slug={post.slug} published={post.status === "published"} /></CardContent></Card>)}</div>}><Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Categoría</TableHead><TableHead>Estado</TableHead><TableHead>Fecha</TableHead><TableHead>Destacada</TableHead><TableHead className="w-14"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((post) => <TableRow key={post.id}><TableCell className="max-w-72 font-medium"><span className="line-clamp-2">{post.title}</span></TableCell><TableCell>{post.category}</TableCell><TableCell><StatusBadge variant={post.status === "published" ? "success" : "neutral"}>{post.status === "published" ? "Publicada" : "Borrador"}</StatusBadge></TableCell><TableCell className="whitespace-nowrap">{post.publishedAt ? formatDate(post.publishedAt) : "—"}</TableCell><TableCell>{post.isFeatured ? <span className="inline-flex items-center gap-1.5"><StarIcon className="size-4" aria-hidden="true" />Sí</span> : "No"}</TableCell><TableCell><PostActions id={post.id} slug={post.slug} published={post.status === "published"} /></TableCell></TableRow>)}</TableBody></Table></AdminTableShell> : <EmptyState icon={NewspaperIcon} title={hasFilters ? "No hay noticias con estos filtros" : "Todavía no hay noticias"} description={hasFilters ? "Probá otra búsqueda o limpiá los filtros." : "Creá la primera noticia del club."} action={hasFilters ? <Button variant="outline" onClick={clear}>Limpiar filtros</Button> : <Button render={<Link href="/admin/noticias/nueva" />} nativeButton={false}>Crear noticia</Button>} />}
  </div>;
}

export { NewsList };

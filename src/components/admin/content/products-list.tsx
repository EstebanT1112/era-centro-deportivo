"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit3Icon, ExternalLinkIcon, PackageIcon, PlusIcon, SearchIcon, StarIcon, XIcon } from "lucide-react";

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
import { PRODUCT_CATEGORIES } from "@/constants/domain";
import { formatCurrency } from "@/lib/formatters";
import { useAdminContent } from "./content-provider";

const categoryItems = [{ value: "all", label: "Todas las categorías" }, ...PRODUCT_CATEGORIES.map((value) => ({ value, label: value }))];
const booleanItems = (all: string, yes: string, no: string) => [{ value: "all", label: all }, { value: "yes", label: yes }, { value: "no", label: no }];

function ProductActions({ id, slug, visible }: { id: string; slug: string; visible: boolean }) {
  return <AdminRowActions label="Abrir acciones de producto"><DropdownMenuItem render={<Link href={`/admin/productos/${id}`} />}><Edit3Icon aria-hidden="true" />Editar</DropdownMenuItem>{visible ? <DropdownMenuItem render={<Link href={`/tienda/${slug}`} />}><ExternalLinkIcon aria-hidden="true" />Ver en sitio</DropdownMenuItem> : <DropdownMenuItem disabled><ExternalLinkIcon aria-hidden="true" />Producto oculto</DropdownMenuItem>}</AdminRowActions>;
}

function ProductsList() {
  const { products } = useAdminContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [visible, setVisible] = useState("all");
  const normalized = search.trim().toLocaleLowerCase("es");
  const filtered = useMemo(() => products.filter((product) => (!normalized || `${product.name} ${product.category}`.toLocaleLowerCase("es").includes(normalized)) && (category === "all" || product.category === category) && (availability === "all" || product.isAvailable === (availability === "yes")) && (featured === "all" || product.isFeatured === (featured === "yes")) && (visible === "all" || product.isVisible === (visible === "yes"))), [availability, category, featured, normalized, products, visible]);
  const hasFilters = !!normalized || category !== "all" || availability !== "all" || featured !== "all" || visible !== "all";
  const clear = () => { setSearch(""); setCategory("all"); setAvailability("all"); setFeatured("all"); setVisible("all"); };
  const select = (items: { value: string; label: string }[], value: string, setValue: (value: string) => void, label: string) => <Select items={items} value={value} onValueChange={(next) => next && setValue(next)}><SelectTrigger aria-label={label} className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>;

  return <div className="flex flex-col gap-5">
    <AdminPageHeader title="Productos" description="Gestioná el catálogo, su disponibilidad y qué productos se muestran en el sitio." actions={<Button render={<Link href="/admin/productos/nuevo" />} nativeButton={false}><PlusIcon data-icon="inline-start" aria-hidden="true" />Agregar producto</Button>} />
    <AdminFilterBar search={<div className="relative"><SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos" aria-label="Buscar por nombre o categoría" className="pl-9" /></div>} filters={<>{select(categoryItems, category, setCategory, "Filtrar productos por categoría")}{select(booleanItems("Toda disponibilidad", "Disponibles", "No disponibles"), availability, setAvailability, "Filtrar por disponibilidad")}{select(booleanItems("Destacados o no", "Destacados", "No destacados"), featured, setFeatured, "Filtrar productos destacados")}{select(booleanItems("Visibles u ocultos", "Visibles", "Ocultos"), visible, setVisible, "Filtrar por visibilidad")}</>} resultCount={<span aria-live="polite">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</span>} clearAction={hasFilters ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null} />
    {filtered.length ? <AdminTableShell title="Catálogo" description="Disponible, visible y destacado son controles independientes." mobileFallback={<div className="grid gap-3 p-3">{filtered.map((product) => <Card key={product.id} size="sm"><CardContent className="flex gap-3"><div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"><Image src={product.images[0]} alt="" fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{product.name}</p><p className="text-sm font-semibold tabular-nums">{formatCurrency(product.price)}</p><div className="mt-2 flex flex-wrap gap-1.5"><StatusBadge variant={product.isAvailable ? "success" : "danger"}>{product.isAvailable ? "Disponible" : "No disponible"}</StatusBadge><StatusBadge variant={product.isVisible ? "info" : "neutral"}>{product.isVisible ? "Visible" : "Oculto"}</StatusBadge></div></div><ProductActions id={product.id} slug={product.slug} visible={product.isVisible} /></CardContent></Card>)}</div>}><Table><TableHeader><TableRow><TableHead>Imagen</TableHead><TableHead>Nombre</TableHead><TableHead>Categoría</TableHead><TableHead>Precio</TableHead><TableHead>Disponibilidad</TableHead><TableHead>Destacado</TableHead><TableHead>Visible</TableHead><TableHead className="w-14"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((product) => <TableRow key={product.id}><TableCell><div className="relative size-11 overflow-hidden rounded-md bg-muted"><Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" /></div></TableCell><TableCell className="max-w-56 font-medium"><span className="line-clamp-2">{product.name}</span></TableCell><TableCell>{product.category}</TableCell><TableCell className="tabular-nums">{formatCurrency(product.price)}</TableCell><TableCell><StatusBadge variant={product.isAvailable ? "success" : "danger"}>{product.isAvailable ? "Disponible" : "No disponible"}</StatusBadge></TableCell><TableCell>{product.isFeatured ? <span className="inline-flex items-center gap-1.5"><StarIcon className="size-4" aria-hidden="true" />Sí</span> : "No"}</TableCell><TableCell><StatusBadge variant={product.isVisible ? "info" : "neutral"}>{product.isVisible ? "Visible" : "Oculto"}</StatusBadge></TableCell><TableCell><ProductActions id={product.id} slug={product.slug} visible={product.isVisible} /></TableCell></TableRow>)}</TableBody></Table></AdminTableShell> : <EmptyState icon={PackageIcon} title={hasFilters ? "No hay productos con estos filtros" : "Todavía no hay productos"} description={hasFilters ? "Probá otra búsqueda o limpiá los filtros." : "Agregá el primer producto del catálogo."} action={hasFilters ? <Button variant="outline" onClick={clear}>Limpiar filtros</Button> : <Button render={<Link href="/admin/productos/nuevo" />} nativeButton={false}>Agregar producto</Button>} />}
  </div>;
}

export { ProductsList };

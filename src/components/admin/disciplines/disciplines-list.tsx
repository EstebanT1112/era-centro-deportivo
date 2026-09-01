"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ExternalLinkIcon, PencilIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminRowActions, AdminTableShell } from "@/components/admin/admin-table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { filterDisciplines, type DisciplineFilters } from "@/lib/admin-disciplines"
import { resolveTeachersByIds } from "@/lib/teachers"
import type { Discipline } from "@/types"

import { useAdminTeachers } from "../teachers/teachers-provider"
import { useAdminDisciplines } from "./disciplines-provider"

const initialFilters: DisciplineFilters = { query: "", visibility: "all", featured: "all" }
const visibilityItems = [
  { value: "all", label: "Toda visibilidad" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Oculta" },
]
const featuredItems = [
  { value: "all", label: "Todas" },
  { value: "featured", label: "Destacada" },
  { value: "not-featured", label: "No destacada" },
]

function DisciplineActions({ discipline }: { discipline: Discipline }) {
  return (
    <AdminRowActions label={`Acciones de ${discipline.name}`}>
      <DropdownMenuItem render={<Link href={`/admin/disciplinas/${discipline.id}`} />}>
        <PencilIcon aria-hidden="true" /> Editar
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!discipline.isVisible}
        render={discipline.isVisible ? <Link href={`/disciplinas/${discipline.slug}`} /> : undefined}
      >
        <ExternalLinkIcon aria-hidden="true" />
        {discipline.isVisible ? "Ver en sitio" : "No visible públicamente"}
      </DropdownMenuItem>
    </AdminRowActions>
  )
}

function TeacherSummary({ discipline, teachers }: { discipline: Discipline; teachers: ReturnType<typeof resolveTeachersByIds> }) {
  const assignedTeachers = resolveTeachersByIds(discipline.responsibleTeacherIds, teachers)
  if (!assignedTeachers.length) return <span className="text-muted-foreground">Sin asignar</span>
  return <span>{assignedTeachers[0].name}{assignedTeachers.length > 1 ? ` + ${assignedTeachers.length - 1}` : ""}</span>
}

function DisciplineState({ discipline }: { discipline: Discipline }) {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge variant={discipline.isVisible ? "success" : "neutral"}>{discipline.isVisible ? "Visible" : "Oculta"}</StatusBadge>
      <StatusBadge variant={discipline.isFeatured ? "info" : "neutral"}>{discipline.isFeatured ? "Destacada" : "No destacada"}</StatusBadge>
    </div>
  )
}

function MobileDisciplineList({ disciplines, teachers }: { disciplines: Discipline[]; teachers: ReturnType<typeof resolveTeachersByIds> }) {
  return (
    <ul className="divide-y divide-border" aria-label="Disciplinas encontradas">
      {disciplines.map((discipline) => {
        const activeCategories = discipline.categories.filter((category) => category.isActive).length
        return (
          <li key={discipline.id} className="flex flex-col gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image src={discipline.coverImage} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/disciplinas/${discipline.id}`} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {discipline.name}
                </Link>
                <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">{discipline.shortDescription}</p>
              </div>
              <DisciplineActions discipline={discipline} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Categorías</dt><dd className="font-semibold tabular-nums">{discipline.categories.length} · {activeCategories} {activeCategories === 1 ? "activa" : "activas"}</dd></div>
              <div><dt className="text-muted-foreground">Responsables</dt><dd className="font-medium"><TeacherSummary discipline={discipline} teachers={teachers} /></dd></div>
              <div className="col-span-2"><dt className="sr-only">Publicación</dt><dd><DisciplineState discipline={discipline} /></dd></div>
            </dl>
          </li>
        )
      })}
    </ul>
  )
}

function DisciplinesList() {
  const { disciplines } = useAdminDisciplines()
  const { teachers } = useAdminTeachers()
  const [filters, setFilters] = useState(initialFilters)
  const filtered = useMemo(() => filterDisciplines(disciplines, filters), [disciplines, filters])
  const hasFilters = filters.query !== "" || filters.visibility !== "all" || filters.featured !== "all"
  const setFilter = <K extends keyof DisciplineFilters>(key: K, value: DisciplineFilters[K]) => setFilters((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex flex-col gap-4">
      <AdminFilterBar
        search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input type="search" aria-label="Buscar disciplinas" placeholder="Nombre o descripción" className="pl-9" value={filters.query} onChange={(event) => setFilter("query", event.target.value)} /></div>}
        filters={<>
          <Select items={visibilityItems} value={filters.visibility} onValueChange={(value) => value && setFilter("visibility", value as DisciplineFilters["visibility"])}><SelectTrigger aria-label="Filtrar por visibilidad" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{visibilityItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <Select items={featuredItems} value={filters.featured} onValueChange={(value) => value && setFilter("featured", value as DisciplineFilters["featured"])}><SelectTrigger aria-label="Filtrar por destacada" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{featuredItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
        </>}
        resultCount={<span aria-live="polite">{hasFilters ? `${filtered.length} de ${disciplines.length} disciplinas` : `${disciplines.length} disciplinas`}</span>}
        clearAction={hasFilters && filtered.length > 0 ? <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : null}
      />

      {filtered.length ? (
        <AdminTableShell title="Disciplinas" description="Actividades deportivas, categorías y estado de publicación." mobileFallback={<MobileDisciplineList disciplines={filtered} teachers={teachers} />}>
          <Table>
            <TableCaption className="sr-only">Disciplinas con categorías, responsables, publicación, orden y acciones.</TableCaption>
            <TableHeader><TableRow><TableHead scope="col">Disciplina</TableHead><TableHead scope="col">Categorías</TableHead><TableHead scope="col">Responsables</TableHead><TableHead scope="col">Visible</TableHead><TableHead scope="col">Destacada</TableHead><TableHead scope="col">Orden</TableHead><TableHead scope="col"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((discipline) => {
              const activeCategories = discipline.categories.filter((category) => category.isActive).length
              return <TableRow key={discipline.id}>
                <TableCell><div className="flex min-w-64 items-center gap-3"><div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted"><Image src={discipline.coverImage} alt="" fill sizes="40px" className="object-cover" /></div><div className="min-w-0"><Link href={`/admin/disciplinas/${discipline.id}`} className="font-semibold text-primary underline-offset-4 hover:underline">{discipline.name}</Link><p className="max-w-xs truncate text-xs text-muted-foreground">{discipline.shortDescription}</p></div></div></TableCell>
                <TableCell className="tabular-nums">{discipline.categories.length} <span className="text-muted-foreground">· {activeCategories} {activeCategories === 1 ? "activa" : "activas"}</span></TableCell>
                <TableCell><TeacherSummary discipline={discipline} teachers={teachers} /></TableCell>
                <TableCell><StatusBadge variant={discipline.isVisible ? "success" : "neutral"}>{discipline.isVisible ? "Visible" : "Oculta"}</StatusBadge></TableCell>
                <TableCell><StatusBadge variant={discipline.isFeatured ? "info" : "neutral"}>{discipline.isFeatured ? "Destacada" : "No destacada"}</StatusBadge></TableCell>
                <TableCell className="tabular-nums">{discipline.order}</TableCell>
                <TableCell className="text-right"><DisciplineActions discipline={discipline} /></TableCell>
              </TableRow>
            })}</TableBody>
          </Table>
        </AdminTableShell>
      ) : (
        <EmptyState
          icon={SlidersHorizontalIcon}
          title={disciplines.length ? "No encontramos disciplinas con estos criterios" : "Todavía no hay disciplinas cargadas"}
          description={disciplines.length ? "Probá con otros términos o volvé a ver todas las disciplinas." : "Creá la primera disciplina para configurar sus categorías y horarios."}
          titleAs="h2"
          action={disciplines.length ? <Button variant="outline" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : <Button render={<Link href="/admin/disciplinas/nueva" />} nativeButton={false}>Nueva disciplina</Button>}
        />
      )}
    </div>
  )
}

export { DisciplinesList }

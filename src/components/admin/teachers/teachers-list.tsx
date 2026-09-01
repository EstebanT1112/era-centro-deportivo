"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ClipboardListIcon, PencilIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminRowActions, AdminTableShell } from "@/components/admin/admin-table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { filterTeachers, formatPhoneForDisplay, type TeacherFilters } from "@/lib/admin-teachers"
import { getTeacherAssignments, type TeacherAssignment } from "@/lib/teachers"
import type { Teacher } from "@/types"

import { useAdminDisciplines } from "../disciplines/disciplines-provider"
import { TeacherAvatar } from "./teacher-avatar"
import { useAdminTeachers } from "./teachers-provider"

const initialFilters: TeacherFilters = { query: "", status: "all", assignments: "all" }
const statusItems = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
]
const assignmentItems = [
  { value: "all", label: "Toda asignación" },
  { value: "assigned", label: "Con asignaciones" },
  { value: "unassigned", label: "Sin asignaciones" },
]

function TeacherActions({ teacher }: { teacher: Teacher }) {
  return (
    <AdminRowActions label={`Acciones de ${teacher.name}`}>
      <DropdownMenuItem render={<Link href={`/admin/profesores/${teacher.id}`} />}><PencilIcon aria-hidden="true" />Editar</DropdownMenuItem>
      <DropdownMenuItem render={<Link href={`/admin/profesores/${teacher.id}#asignaciones`} />}><ClipboardListIcon aria-hidden="true" />Ver asignaciones</DropdownMenuItem>
    </AdminRowActions>
  )
}

function AssignmentSummary({ assignments }: { assignments: TeacherAssignment[] }) {
  if (!assignments.length) return <span className="text-muted-foreground">Sin asignaciones</span>
  const visible = assignments.slice(0, 2).map((assignment) => assignment.role === "responsible" ? `${assignment.disciplineName} · Responsable` : `${assignment.disciplineName} · ${assignment.categoryName}`)
  return (
    <div className="flex flex-col gap-0.5">
      {visible.map((label) => <span key={label} className="max-w-64 truncate">{label}</span>)}
      {assignments.length > 2 ? <span className="text-xs font-medium text-primary">+{assignments.length - 2} más</span> : null}
    </div>
  )
}

function MobileTeacherList({ teachers, getAssignments }: { teachers: Teacher[]; getAssignments: (id: string) => TeacherAssignment[] }) {
  return (
    <ul className="divide-y divide-border" aria-label="Profesores encontrados">
      {teachers.map((teacher) => {
        const assignments = getAssignments(teacher.id)
        return (
          <li key={teacher.id} className="flex flex-col gap-4 p-4">
            <div className="flex min-w-0 items-start gap-3">
              <TeacherAvatar name={teacher.name} image={teacher.image} />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/profesores/${teacher.id}`} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">{teacher.name}</Link>
                <p className="text-sm tabular-nums text-foreground">{formatPhoneForDisplay(teacher.phone)}</p>
                {teacher.email ? <p className="truncate text-xs text-muted-foreground">{teacher.email}</p> : null}
              </div>
              <TeacherActions teacher={teacher} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge variant={teacher.isActive ? "success" : "neutral"}>{teacher.isActive ? "Activo" : "Inactivo"}</StatusBadge>
              <span className="text-sm font-medium tabular-nums">{assignments.length} {assignments.length === 1 ? "asignación" : "asignaciones"}</span>
            </div>
            <AssignmentSummary assignments={assignments} />
          </li>
        )
      })}
    </ul>
  )
}

function TeachersList() {
  const { teachers } = useAdminTeachers()
  const { disciplines } = useAdminDisciplines()
  const [filters, setFilters] = useState(initialFilters)
  const filtered = useMemo(() => filterTeachers(teachers, disciplines, filters), [teachers, disciplines, filters])
  const assignmentsByTeacher = useMemo(() => new Map(teachers.map((teacher) => [teacher.id, getTeacherAssignments(teacher.id, disciplines)])), [teachers, disciplines])
  const getAssignments = (id: string) => assignmentsByTeacher.get(id) ?? []
  const hasFilters = filters.query !== "" || filters.status !== "all" || filters.assignments !== "all"
  const setFilter = <K extends keyof TeacherFilters>(key: K, value: TeacherFilters[K]) => setFilters((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex flex-col gap-4">
      <AdminFilterBar
        search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input type="search" aria-label="Buscar profesores" placeholder="Nombre, teléfono o email" className="pl-9" value={filters.query} onChange={(event) => setFilter("query", event.target.value)} /></div>}
        filters={<>
          <Select items={statusItems} value={filters.status} onValueChange={(value) => value && setFilter("status", value as TeacherFilters["status"])}><SelectTrigger aria-label="Filtrar profesores por estado" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <Select items={assignmentItems} value={filters.assignments} onValueChange={(value) => value && setFilter("assignments", value as TeacherFilters["assignments"])}><SelectTrigger aria-label="Filtrar profesores por asignaciones" className="sm:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{assignmentItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
        </>}
        resultCount={<span aria-live="polite">{hasFilters ? `${filtered.length} de ${teachers.length} profesores` : `${teachers.length} profesores`}</span>}
        clearAction={hasFilters && filtered.length > 0 ? <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : null}
      />

      {filtered.length ? (
        <AdminTableShell title="Profesores" description="Contacto, disponibilidad y asignaciones derivadas de Disciplinas." mobileFallback={<MobileTeacherList teachers={filtered} getAssignments={getAssignments} />}>
          <Table>
            <TableCaption className="sr-only">Profesores con contacto, asignaciones, estado y acciones.</TableCaption>
            <TableHeader><TableRow><TableHead scope="col">Profesor</TableHead><TableHead scope="col">Contacto</TableHead><TableHead scope="col">Asignaciones</TableHead><TableHead scope="col">Estado</TableHead><TableHead scope="col"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((teacher) => {
              const assignments = getAssignments(teacher.id)
              return (
                <TableRow key={teacher.id}>
                  <TableCell><div className="flex min-w-52 items-center gap-3"><TeacherAvatar name={teacher.name} image={teacher.image} size="sm" /><div className="min-w-0"><Link href={`/admin/profesores/${teacher.id}`} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">{teacher.name}</Link>{teacher.email ? <p className="max-w-56 truncate text-xs text-muted-foreground">{teacher.email}</p> : null}</div></div></TableCell>
                  <TableCell className="font-medium tabular-nums">{formatPhoneForDisplay(teacher.phone)}</TableCell>
                  <TableCell><AssignmentSummary assignments={assignments} /></TableCell>
                  <TableCell><StatusBadge variant={teacher.isActive ? "success" : "neutral"}>{teacher.isActive ? "Activo" : "Inactivo"}</StatusBadge></TableCell>
                  <TableCell className="text-right"><TeacherActions teacher={teacher} /></TableCell>
                </TableRow>
              )
            })}</TableBody>
          </Table>
        </AdminTableShell>
      ) : (
        <EmptyState
          icon={SlidersHorizontalIcon}
          title={teachers.length ? "No encontramos profesores con estos criterios" : "Todavía no hay profesores cargados"}
          description={teachers.length ? "Probá con otro nombre, teléfono o estado." : "Creá el primer perfil para asociarlo luego desde Disciplinas."}
          titleAs="h2"
          action={teachers.length ? <Button variant="outline" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : <Button render={<Link href="/admin/profesores/nuevo" />} nativeButton={false}>Nuevo profesor</Button>}
        />
      )}
    </div>
  )
}

export { TeachersList }

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, PencilIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminRowActions, AdminTableShell } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COURT_STATUSES, COURT_TYPES } from "@/constants/domain";
import { filterCourts, type CourtFilters } from "@/lib/admin-courts";
import { formatCurrency } from "@/lib/formatters";
import { getCourtStatusPresentation } from "@/lib/status-presentations";
import type { Court, CourtStatus, CourtType } from "@/types";
import { useAdminCourts } from "./courts-provider";

const initialFilters: CourtFilters = { query: "", type: "all", status: "all" };
const typeItems = [{ value: "all", label: "Todos los tipos" }, ...COURT_TYPES];
const statusItems = [{ value: "all", label: "Todos los estados" }, ...COURT_STATUSES];

function CourtActions({ court }: { court: Court }) {
  return (
    <AdminRowActions label={`Acciones de ${court.name}`}>
      <DropdownMenuItem render={<Link href={`/admin/canchas/${court.id}`} />}>
        <PencilIcon aria-hidden="true" /> Editar
      </DropdownMenuItem>
      <DropdownMenuItem render={<Link href={`/canchas/${court.slug}`} />}>
        <ExternalLinkIcon aria-hidden="true" /> Ver en sitio público
      </DropdownMenuItem>
    </AdminRowActions>
  );
}

function CourtState({ court }: { court: Court }) {
  const presentation = getCourtStatusPresentation(court.status);
  return <StatusBadge variant={presentation.variant}>{presentation.label}</StatusBadge>;
}

function MobileCourtList({ courts }: { courts: Court[] }) {
  return (
    <ul className="divide-y divide-border" aria-label="Canchas encontradas">
      {courts.map((court) => {
        const type = COURT_TYPES.find((item) => item.value === court.type)?.label;
        return (
          <li key={court.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/admin/canchas/${court.id}`} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {court.name}
                </Link>
                <p className="text-sm text-muted-foreground">{type} · {court.surface}</p>
              </div>
              <CourtActions court={court} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Precio por turno</dt><dd className="font-semibold tabular-nums">{formatCurrency(court.pricePerSlot)}</dd></div>
              <div><dt className="text-muted-foreground">Duración</dt><dd className="font-semibold tabular-nums">{court.slotMinutes} min</dd></div>
              <div><dt className="text-muted-foreground">Orden</dt><dd className="font-semibold tabular-nums">{court.order}</dd></div>
              <div><dt className="sr-only">Estado</dt><dd><CourtState court={court} /></dd></div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}

function CourtsList() {
  const { courts } = useAdminCourts();
  const [filters, setFilters] = useState(initialFilters);
  const filtered = useMemo(() => filterCourts(courts, filters), [courts, filters]);
  const hasFilters = Object.entries(filters).some(([key, value]) => value !== initialFilters[key as keyof CourtFilters]);
  const setFilter = <K extends keyof CourtFilters>(key: K, value: CourtFilters[K]) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="flex flex-col gap-4">
      <AdminFilterBar
        search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input type="search" aria-label="Buscar canchas" placeholder="Nombre o tipo" className="pl-9" value={filters.query} onChange={(event) => setFilter("query", event.target.value)} /></div>}
        filters={<>
          <Select items={typeItems} value={filters.type} onValueChange={(value) => value && setFilter("type", value as "all" | CourtType)}><SelectTrigger aria-label="Filtrar por tipo" className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{typeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <Select items={statusItems} value={filters.status} onValueChange={(value) => value && setFilter("status", value as "all" | CourtStatus)}><SelectTrigger aria-label="Filtrar por estado" className="sm:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
        </>}
        resultCount={<span aria-live="polite">{hasFilters ? `${filtered.length} de ${courts.length} canchas` : `${courts.length} canchas`}</span>}
        clearAction={hasFilters && filtered.length > 0 ? <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : null}
      />

      {filtered.length ? (
        <AdminTableShell title="Canchas" description="Orden de presentación, configuración del turno y estado operativo." mobileFallback={<MobileCourtList courts={filtered} />}>
          <Table>
            <TableCaption className="sr-only">Canchas con tipo, superficie, precio, duración, estado, orden y acciones.</TableCaption>
            <TableHeader><TableRow><TableHead scope="col">Nombre</TableHead><TableHead scope="col">Tipo</TableHead><TableHead scope="col">Superficie</TableHead><TableHead scope="col">Precio</TableHead><TableHead scope="col">Duración</TableHead><TableHead scope="col">Estado</TableHead><TableHead scope="col">Orden</TableHead><TableHead scope="col"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map((court) => <TableRow key={court.id}>
              <TableCell><Link href={`/admin/canchas/${court.id}`} className="font-semibold text-primary underline-offset-4 hover:underline">{court.name}</Link></TableCell>
              <TableCell>{COURT_TYPES.find((item) => item.value === court.type)?.label}</TableCell>
              <TableCell>{court.surface}</TableCell>
              <TableCell className="tabular-nums">{formatCurrency(court.pricePerSlot)} <span className="text-muted-foreground">/ turno</span></TableCell>
              <TableCell className="tabular-nums">{court.slotMinutes} min</TableCell>
              <TableCell><CourtState court={court} /></TableCell>
              <TableCell className="tabular-nums">{court.order}</TableCell>
              <TableCell className="text-right"><CourtActions court={court} /></TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </AdminTableShell>
      ) : (
        <EmptyState icon={SlidersHorizontalIcon} title={courts.length ? "No encontramos canchas con estos filtros" : "Todavía no hay canchas"} description={courts.length ? "Probá con otros criterios o volvé a ver todas las canchas." : "Agregá la primera cancha para comenzar a configurarla."} titleAs="h2" action={courts.length ? <Button variant="outline" onClick={() => setFilters(initialFilters)}>Limpiar filtros</Button> : <Button render={<Link href="/admin/canchas/nueva" />} nativeButton={false}>Agregar cancha</Button>} />
      )}
    </div>
  );
}

export { CourtsList };

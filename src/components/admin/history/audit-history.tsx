"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRightIcon, CircleDotIcon, HistoryIcon, SearchIcon, XIcon } from "lucide-react"

import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge, type StatusBadgeVariant } from "@/components/shared/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auditLog, adminUsers } from "@/mocks"
import type { AuditActionType, AuditLogEntry } from "@/types"

const actionLabels: Record<AuditActionType, string> = { create: "Creación", update: "Actualización", payment: "Pago", status_change: "Cambio de estado", publish: "Publicación", block: "Bloqueo", other: "Otra acción" }
const actionVariants: Record<AuditActionType, StatusBadgeVariant> = { create: "success", update: "info", payment: "success", status_change: "warning", publish: "info", block: "danger", other: "neutral" }
const actionItems = [{ value: "all", label: "Todos los tipos" }, ...Object.entries(actionLabels).map(([value, label]) => ({ value, label }))]
const entityLabels = { reservation: "Reserva", court: "Cancha", post: "Noticia", product: "Producto", user: "Usuario", settings: "Configuración" }
const entityItems = [{ value: "all", label: "Todas las entidades" }, ...Object.entries(entityLabels).map(([value, label]) => ({ value, label }))]
const userItems = [{ value: "all", label: "Todos los usuarios" }, ...adminUsers.map((user) => ({ value: user.id, label: user.name }))]

function entityHref(entry: AuditLogEntry) {
  if (!entry.entityId) return undefined
  if (entry.entityType === "reservation") return `/admin/reservas/${entry.entityId}`
  if (entry.entityType === "court") return `/admin/canchas/${entry.entityId}`
  if (entry.entityType === "post") return `/admin/noticias/${entry.entityId}`
  if (entry.entityType === "product") return `/admin/productos/${entry.entityId}`
}

function formatAuditTimestamp(timestamp: string) {
  const [date, time] = timestamp.split("T")
  const [year, month, day] = date.split("-")

  return `${day}/${month}/${year}, ${time.slice(0, 5)} h`
}

function AuditHistory() {
  const [search, setSearch] = useState("")
  const [user, setUser] = useState("all")
  const [action, setAction] = useState("all")
  const [entity, setEntity] = useState("all")
  const normalized = search.trim().toLocaleLowerCase("es")
  const entries = useMemo(() => auditLog.toSorted((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).filter((entry) => (!normalized || entry.message.toLocaleLowerCase("es").includes(normalized)) && (user === "all" || entry.userId === user) && (action === "all" || entry.actionType === action) && (entity === "all" || entry.entityType === entity)), [action, entity, normalized, user])
  const clear = () => { setSearch(""); setUser("all"); setAction("all"); setEntity("all") }
  const select = (items: { value: string; label: string }[], value: string, setter: (value: string) => void, label: string) => <Select items={items} value={value} onValueChange={(next) => next && setter(next)}><SelectTrigger aria-label={label} className="sm:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Historial de acciones" description="Registro cronológico simulado de los cambios realizados desde el panel." /><AdminFilterBar search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar acciones" aria-label="Buscar en los mensajes del historial" className="pl-9" /></div>} filters={<>{select(userItems, user, setUser, "Filtrar por usuario")}{select(actionItems, action, setAction, "Filtrar por tipo de acción")}{select(entityItems, entity, setEntity, "Filtrar por entidad")}</>} resultCount={<span aria-live="polite">{entries.length} {entries.length === 1 ? "acción" : "acciones"}</span>} clearAction={normalized || user !== "all" || action !== "all" || entity !== "all" ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null} />
    {entries.length ? <Card><CardContent className="p-0"><ol className="divide-y divide-border" aria-label="Acciones administrativas, más recientes primero">{entries.map((entry) => { const actor = adminUsers.find((item) => item.id === entry.userId); const href = entityHref(entry); return <li key={entry.id} className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:p-5"><span className="mt-1 flex size-8 items-center justify-center rounded-full border border-border bg-background-subtle text-primary"><CircleDotIcon className="size-4" aria-hidden="true" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge variant={actionVariants[entry.actionType]}>{actionLabels[entry.actionType]}</StatusBadge>{entry.entityType ? <span className="text-xs font-medium text-muted-foreground">{entityLabels[entry.entityType]}</span> : null}</div><p className="mt-2 text-pretty"><strong>{actor?.name ?? "Usuario del panel"}</strong> {entry.message}</p><time dateTime={entry.timestamp} className="mt-1 block text-sm tabular-nums text-muted-foreground">{formatAuditTimestamp(entry.timestamp)}</time></div>{href ? <Link href={href} className={buttonVariants({ variant: "ghost", size: "sm" })}>Ver entidad<ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" /></Link> : null}</li>})}</ol></CardContent></Card> : <EmptyState icon={HistoryIcon} title="Todavía no hay acciones registradas" description="Limpiá los filtros para volver a consultar el historial mock." action={<Button variant="outline" onClick={clear}>Limpiar filtros</Button>} />}
  </div>
}

export { AuditHistory }

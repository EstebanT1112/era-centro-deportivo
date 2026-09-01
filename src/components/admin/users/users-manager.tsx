"use client"

import { useMemo, useState } from "react"
import { Edit3Icon, PlusIcon, SearchIcon, UserRoundIcon, XIcon } from "lucide-react"

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog"
import { AdminFilterBar } from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminTableShell } from "@/components/admin/admin-table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { adminUsers as initialUsers } from "@/mocks"
import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/types"

const roleItems = [{ value: "admin", label: "Administrador" }, { value: "employee", label: "Empleado" }]
const statusItems = [{ value: "active", label: "Activo" }, { value: "inactive", label: "Inactivo" }]
const roleFilterItems = [{ value: "all", label: "Todos los roles" }, ...roleItems]
const statusFilterItems = [{ value: "all", label: "Todos los estados" }, ...statusItems]
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type UserDraft = Omit<AdminUser, "id">

function UserForm({ user, onSave, onClose }: { user?: AdminUser; onSave: (draft: UserDraft) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<UserDraft>(user ? { ...user } : { name: "", email: "", role: "employee", status: "active" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const setValue = <K extends keyof UserDraft>(key: K, value: UserDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const submit = () => {
    const next: Record<string, string> = {}
    if (!draft.name.trim()) next.name = "Ingresá el nombre."
    if (!draft.email.trim()) next.email = "Ingresá el email."
    else if (!emailPattern.test(draft.email)) next.email = "Ingresá un email válido."
    if (!draft.role) next.role = "Seleccioná un rol."
    if (!draft.status) next.status = "Seleccioná un estado."
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim().toLowerCase() })
  }
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{user ? "Editar usuario" : "Agregar usuario"}</DialogTitle><DialogDescription>Estos datos representan acceso al panel, sin crear credenciales reales.</DialogDescription></DialogHeader><FieldGroup>
    <Field data-invalid={!!errors.name}><FieldLabel htmlFor="user-name">Nombre</FieldLabel><Input id="user-name" autoComplete="name" value={draft.name} onChange={(event) => setValue("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "user-name-error" : undefined} />{errors.name ? <FieldError id="user-name-error">{errors.name}</FieldError> : null}</Field>
    <Field data-invalid={!!errors.email}><FieldLabel htmlFor="user-email">Email</FieldLabel><Input id="user-email" type="email" autoComplete="email" value={draft.email} onChange={(event) => setValue("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "user-email-error" : undefined} />{errors.email ? <FieldError id="user-email-error">{errors.email}</FieldError> : null}</Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="user-role">Rol</FieldLabel><Select items={roleItems} value={draft.role} onValueChange={(value) => value && setValue("role", value as AdminUserRole)}><SelectTrigger id="user-role"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{roleItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field><Field><FieldLabel htmlFor="user-status">Estado</FieldLabel><Select items={statusItems} value={draft.status} onValueChange={(value) => value && setValue("status", value as AdminUserStatus)}><SelectTrigger id="user-status"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field></div>
  </FieldGroup><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={submit}>Guardar usuario</Button></DialogFooter></DialogContent></Dialog>
}

function UserStatusAction({ user, onToggle }: { user: AdminUser; onToggle: () => void }) {
  if (user.status === "inactive") return <Button variant="ghost" size="sm" onClick={onToggle}>Activar</Button>
  return <AdminConfirmDialog trigger={<Button variant="ghost" size="sm">Desactivar</Button>} title="¿Desactivar este usuario?" description={`${user.name} dejará de figurar como usuario activo del panel. Esta acción solo afecta al estado mock.`} confirmLabel="Desactivar" onConfirm={onToggle} />
}

function UsersManager() {
  const [users, setUsers] = useState(() => initialUsers.map((user) => ({ ...user })))
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  const [editing, setEditing] = useState<AdminUser | "new" | null>(null)
  const normalized = search.trim().toLocaleLowerCase("es")
  const filtered = useMemo(() => users.filter((user) => (!normalized || `${user.name} ${user.email}`.toLocaleLowerCase("es").includes(normalized)) && (role === "all" || user.role === role) && (status === "all" || user.status === status)), [normalized, role, status, users])
  const clear = () => { setSearch(""); setRole("all"); setStatus("all") }
  const save = (draft: UserDraft) => {
    if (editing === "new") setUsers((items) => [...items, { ...draft, id: `user-${Math.random().toString(36).slice(2, 9)}` }])
    else if (editing) setUsers((items) => items.map((item) => item.id === editing.id ? { ...draft, id: editing.id } : item))
    toast.add({ title: editing === "new" ? "Usuario agregado correctamente" : "Usuario actualizado correctamente", description: "El cambio se mantiene durante esta sesión.", type: "success" })
    setEditing(null)
  }
  const toggleStatus = (id: string) => setUsers((items) => items.map((user) => user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user))
  const select = (items: { value: string; label: string }[], value: string, setter: (value: string) => void, label: string) => <Select items={items} value={value} onValueChange={(next) => next && setter(next)}><SelectTrigger aria-label={label} className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
  const mobile = <div className="grid gap-3 p-3">{filtered.map((user) => <Card key={user.id} size="sm"><CardContent className="flex flex-col gap-3"><div className="min-w-0"><p className="font-semibold">{user.name}</p><p className="truncate text-sm text-muted-foreground">{user.email}</p></div><div className="flex flex-wrap gap-2"><StatusBadge variant={user.role === "admin" ? "info" : "neutral"}>{user.role === "admin" ? "Administrador" : "Empleado"}</StatusBadge><StatusBadge variant={user.status === "active" ? "success" : "neutral"}>{user.status === "active" ? "Activo" : "Inactivo"}</StatusBadge></div><div className="flex flex-wrap justify-end gap-1"><UserStatusAction user={user} onToggle={() => toggleStatus(user.id)} /><Button variant="outline" size="sm" onClick={() => setEditing(user)}><Edit3Icon data-icon="inline-start" aria-hidden="true" />Editar</Button></div></CardContent></Card>)}</div>
  return <div className="flex flex-col gap-5"><AdminPageHeader title="Usuarios" description="Administrá las personas representadas con acceso al panel y su rol operativo." actions={<Button onClick={() => setEditing("new")}><PlusIcon data-icon="inline-start" aria-hidden="true" />Agregar usuario</Button>} /><AdminFilterBar search={<div className="relative"><SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar usuarios" aria-label="Buscar usuarios por nombre o email" className="pl-9" /></div>} filters={<>{select(roleFilterItems, role, setRole, "Filtrar por rol")}{select(statusFilterItems, status, setStatus, "Filtrar por estado")}</>} resultCount={<span aria-live="polite">{filtered.length} {filtered.length === 1 ? "usuario" : "usuarios"}</span>} clearAction={normalized || role !== "all" || status !== "all" ? <Button variant="ghost" size="sm" onClick={clear}><XIcon data-icon="inline-start" aria-hidden="true" />Limpiar</Button> : null} />
    {filtered.length ? <AdminTableShell title="Personas con acceso" description="Los roles son informativos; este prototipo no aplica permisos." mobileFallback={mobile}><Table><TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Rol</TableHead><TableHead>Estado</TableHead><TableHead className="w-52"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((user) => <TableRow key={user.id}><TableCell className="font-medium">{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell><StatusBadge variant={user.role === "admin" ? "info" : "neutral"}>{user.role === "admin" ? "Administrador" : "Empleado"}</StatusBadge></TableCell><TableCell><StatusBadge variant={user.status === "active" ? "success" : "neutral"}>{user.status === "active" ? "Activo" : "Inactivo"}</StatusBadge></TableCell><TableCell><div className="flex justify-end gap-1"><UserStatusAction user={user} onToggle={() => toggleStatus(user.id)} /><Button variant="ghost" size="sm" onClick={() => setEditing(user)}><Edit3Icon data-icon="inline-start" aria-hidden="true" />Editar</Button></div></TableCell></TableRow>)}</TableBody></Table></AdminTableShell> : <EmptyState icon={UserRoundIcon} title="No hay usuarios con estos filtros" description="Probá otra búsqueda o limpiá los filtros activos." action={<Button variant="outline" onClick={clear}>Limpiar filtros</Button>} />}
    {editing ? <UserForm key={editing === "new" ? "new" : editing.id} user={editing === "new" ? undefined : editing} onSave={save} onClose={() => setEditing(null)} /> : null}</div>
}

export { UsersManager }

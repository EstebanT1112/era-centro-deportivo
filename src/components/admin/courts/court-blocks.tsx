"use client";

import { useState, type FormEvent } from "react";
import { BanIcon, CalendarPlusIcon, Trash2Icon } from "lucide-react";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { validateCourtBlock } from "@/lib/admin-courts";
import { formatDate } from "@/lib/formatters";
import type { CourtBlock } from "@/types";
import { useAdminCourts } from "./courts-provider";

const emptyBlock = { date: "", startTime: "18:00", endTime: "20:00", reason: "" };

function DeleteBlockAction({ block }: { block: CourtBlock }) {
  const { removeBlock } = useAdminCourts();
  return (
    <AdminConfirmDialog
      trigger={<Button type="button" variant="ghost" size="icon-sm" aria-label={`Eliminar bloqueo del ${formatDate(block.date)}`}><Trash2Icon aria-hidden="true" /></Button>}
      title="¿Eliminar este bloqueo?"
      description={`${formatDate(block.date)}, de ${block.startTime} a ${block.endTime}. La disponibilidad volverá a quedar libre solamente en este estado local.`}
      confirmLabel="Eliminar bloqueo"
      onConfirm={() => { removeBlock(block.id); toast.add({ title: "Bloqueo eliminado", type: "success" }); }}
    />
  );
}

function CourtBlocks({ courtId }: { courtId: string }) {
  const { blocks, addBlock } = useAdminCourts();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyBlock);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const courtBlocks = blocks.filter((block) => block.courtId === courtId).toSorted((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedDraft = {
      date: String(formData.get("date") ?? draft.date),
      startTime: String(formData.get("startTime") ?? draft.startTime),
      endTime: String(formData.get("endTime") ?? draft.endTime),
      reason: String(formData.get("reason") ?? draft.reason),
    };
    setDraft(submittedDraft);
    const nextErrors = validateCourtBlock(submittedDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    addBlock(courtId, { ...submittedDraft, reason: submittedDraft.reason.trim() });
    setDraft(emptyBlock);
    setOpen(false);
    toast.add({ title: "Bloqueo creado", description: "El cambio se mantiene durante esta sesión de navegación.", type: "success" });
  }

  const setValue = (key: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-pretty text-muted-foreground">Un bloqueo afecta solamente una fecha y rango horario; no cambia el estado general de la cancha.</p>
        <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setErrors({}); }}>
          <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}><CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />Nuevo bloqueo</DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit} noValidate>
              <DialogHeader><DialogTitle>Nuevo bloqueo</DialogTitle><DialogDescription>Reservá temporalmente un rango para mantenimiento o una actividad interna.</DialogDescription></DialogHeader>
              {Object.keys(errors).length ? <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">Revisá los campos indicados.</p> : null}
              <FieldGroup className="mt-5">
                <Field data-invalid={!!errors.date}><FieldLabel htmlFor="block-date">Fecha</FieldLabel><Input id="block-date" name="date" type="date" required value={draft.date} onChange={(event) => setValue("date", event.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? "block-date-error" : undefined} />{errors.date ? <FieldError id="block-date-error">{errors.date}</FieldError> : null}</Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.startTime}><FieldLabel htmlFor="block-start">Hora desde</FieldLabel><Input id="block-start" name="startTime" type="time" required value={draft.startTime} onChange={(event) => setValue("startTime", event.target.value)} aria-invalid={!!errors.startTime} aria-describedby={errors.startTime ? "block-start-error" : undefined} />{errors.startTime ? <FieldError id="block-start-error">{errors.startTime}</FieldError> : null}</Field>
                  <Field data-invalid={!!errors.endTime}><FieldLabel htmlFor="block-end">Hora hasta</FieldLabel><Input id="block-end" name="endTime" type="time" required value={draft.endTime} onChange={(event) => setValue("endTime", event.target.value)} aria-invalid={!!errors.endTime} aria-describedby={errors.endTime ? "block-end-error" : undefined} />{errors.endTime ? <FieldError id="block-end-error">{errors.endTime}</FieldError> : null}</Field>
                </div>
                <Field data-invalid={!!errors.reason}><FieldLabel htmlFor="block-reason">Motivo</FieldLabel><Textarea id="block-reason" name="reason" required value={draft.reason} onChange={(event) => setValue("reason", event.target.value)} placeholder="Mantenimiento de luminarias" aria-invalid={!!errors.reason} aria-describedby={errors.reason ? "block-reason-error" : undefined} />{errors.reason ? <FieldError id="block-reason-error">{errors.reason}</FieldError> : null}</Field>
              </FieldGroup>
              <DialogFooter className="mt-5"><DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose><Button type="submit"><BanIcon data-icon="inline-start" aria-hidden="true" />Crear bloqueo</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {courtBlocks.length ? <>
        <div className="hidden md:block"><Table><TableCaption className="sr-only">Bloqueos de fecha y horario de esta cancha.</TableCaption><TableHeader><TableRow><TableHead scope="col">Fecha</TableHead><TableHead scope="col">Horario</TableHead><TableHead scope="col">Motivo</TableHead><TableHead scope="col"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>{courtBlocks.map((block) => <TableRow key={block.id}><TableCell>{formatDate(block.date)}</TableCell><TableCell className="tabular-nums">{block.startTime}–{block.endTime}</TableCell><TableCell className="whitespace-normal">{block.reason}</TableCell><TableCell className="text-right"><DeleteBlockAction block={block} /></TableCell></TableRow>)}</TableBody></Table></div>
        <ul className="divide-y divide-border rounded-lg border border-border md:hidden" aria-label="Bloqueos de la cancha">{courtBlocks.map((block) => <li key={block.id} className="flex items-start justify-between gap-3 p-3"><div><p className="font-medium">{formatDate(block.date)}</p><p className="text-sm tabular-nums text-muted-foreground">{block.startTime}–{block.endTime}</p><p className="mt-1 text-sm">{block.reason}</p></div><DeleteBlockAction block={block} /></li>)}</ul>
      </> : <div className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-7 text-center"><p className="font-medium">Sin bloqueos programados</p><p className="mt-1 text-sm text-muted-foreground">La cancha no tiene cierres puntuales cargados.</p></div>}
    </div>
  );
}

export { CourtBlocks };

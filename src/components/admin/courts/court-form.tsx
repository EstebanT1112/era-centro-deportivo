"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2Icon, ExternalLinkIcon, SaveIcon } from "lucide-react";

import { FormActions, FormGrid, FormSection } from "@/components/admin/admin-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { COURT_FEATURES, COURT_SERVICES, COURT_STATUSES, COURT_TYPES } from "@/constants/domain";
import { cloneCourt, createEmptyCourt, slugifyCourtName, validateCourt, type CourtDraft } from "@/lib/admin-courts";
import type { CourtFeature, CourtService, CourtStatus, CourtType } from "@/types";
import { CourtBlocks } from "./court-blocks";
import { CourtImageManager } from "./court-image-manager";
import { useAdminCourts } from "./courts-provider";
import { WeeklySchedule } from "./weekly-schedule";

const slotItems = [60, 90, 120].map((minutes) => ({ value: String(minutes), label: `${minutes} min` }));

function CourtForm({ courtId }: { courtId: string }) {
  const router = useRouter();
  const { courts, addCourt, updateCourt } = useAdminCourts();
  const isNew = courtId === "nueva";
  const existingCourt = courts.find((court) => court.id === courtId);
  const [draft, setDraft] = useState<CourtDraft>(() => isNew ? createEmptyCourt(courts.length + 1) : existingCourt ? cloneCourt(existingCourt) : createEmptyCourt(courts.length + 1));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  if (!isNew && !existingCourt) {
    return <EmptyState icon={Building2Icon} title="Cancha no encontrada" description="El identificador no corresponde a una cancha mock ni a una creada durante esta sesión." titleAs="h1" action={<Button render={<Link href="/admin/canchas" />} nativeButton={false}>Volver a canchas</Button>} />;
  }

  const setValue = <K extends keyof CourtDraft>(key: K, value: CourtDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleService = (service: CourtService, checked: boolean) => setValue("services", checked ? [...draft.services, service] : draft.services.filter((item) => item !== service));
  const toggleFeature = (feature: CourtFeature, checked: boolean) => setValue("features", checked ? [...draft.features, feature] : draft.features.filter((item) => item !== feature));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedDraft: CourtDraft = {
      ...draft,
      name: String(formData.get("name") ?? draft.name),
      description: String(formData.get("description") ?? draft.description),
      surface: String(formData.get("surface") ?? draft.surface),
      pricePerSlot: Number(formData.get("pricePerSlot") ?? draft.pricePerSlot),
      order: Number(formData.get("order") ?? draft.order),
      weeklySchedule: draft.weeklySchedule.map((day) => day.enabled ? {
        ...day,
        startTime: String(formData.get(`schedule-${day.weekday}-start`) ?? day.startTime),
        endTime: String(formData.get(`schedule-${day.weekday}-end`) ?? day.endTime),
      } : day),
    };
    setDraft(submittedDraft);
    const nextErrors = validateCourt(submittedDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById("court-form-errors")?.focus();
      return;
    }
    setSaving(true);
    const savedCourt = isNew ? addCourt(submittedDraft) : updateCourt(courtId, submittedDraft);
    setSaving(false);
    if (!savedCourt) return;
    toast.add({ title: isNew ? "Cancha creada correctamente" : "Cancha actualizada correctamente", description: `${savedCourt.name} · cambios guardados en estado local.`, type: "success" });
    if (isNew) router.replace(`/admin/canchas/${savedCourt.id}`);
  }

  const statusDescription = draft.status === "active" ? "Visible y reservable." : draft.status === "maintenance" ? "Visible públicamente, pero no reservable." : "No operativa; la edición se conserva en el panel.";

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title={isNew ? "Nueva cancha" : "Editar cancha"}
        description={isNew ? "Configurá una cancha antes de habilitarla públicamente." : existingCourt!.name}
        breadcrumbs={[{ label: "Canchas", href: "/admin/canchas" }, { label: isNew ? "Nueva cancha" : existingCourt!.name }]}
        actions={<>{!isNew ? <Button variant="outline" render={<Link href={`/canchas/${existingCourt!.slug}`} />} nativeButton={false}><ExternalLinkIcon data-icon="inline-start" aria-hidden="true" />Ver en sitio</Button> : null}<Button type="submit" form="court-form" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear cancha" : "Guardar cambios"}</Button></>}
      />

      <form id="court-form" onSubmit={handleSubmit} noValidate className="grid gap-4 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-8">
          {Object.keys(errors).length ? <div id="court-form-errors" role="alert" tabIndex={-1} className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><p className="font-semibold">Revisá los campos indicados.</p><p className="mt-1">Hay {Object.keys(errors).length} {Object.keys(errors).length === 1 ? "dato pendiente" : "datos pendientes"} antes de guardar.</p></div> : null}

          <FormSection title="Información general" description="Datos que identifican la cancha en el panel y en su presentación pública.">
            <FieldGroup><FormGrid>
              <Field data-invalid={!!errors.name}><FieldLabel htmlFor="court-name">Nombre</FieldLabel><Input id="court-name" name="name" required value={draft.name} onChange={(event) => setValue("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "court-name-error" : "court-slug-preview"} />{errors.name ? <FieldError id="court-name-error">{errors.name}</FieldError> : null}<FieldDescription id="court-slug-preview">URL prevista: /canchas/{slugifyCourtName(draft.name) || "nombre-de-cancha"}</FieldDescription></Field>
              <Field><FieldLabel htmlFor="court-type">Tipo</FieldLabel><Select items={COURT_TYPES} value={draft.type} onValueChange={(value) => value && setValue("type", value as CourtType)}><SelectTrigger id="court-type"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{COURT_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
              <Field data-invalid={!!errors.surface}><FieldLabel htmlFor="court-surface">Superficie</FieldLabel><Input id="court-surface" name="surface" required value={draft.surface} onChange={(event) => setValue("surface", event.target.value)} aria-invalid={!!errors.surface} aria-describedby={errors.surface ? "court-surface-error" : undefined} />{errors.surface ? <FieldError id="court-surface-error">{errors.surface}</FieldError> : null}</Field>
              <Field className="md:col-span-2" data-invalid={!!errors.description}><FieldLabel htmlFor="court-description">Descripción</FieldLabel><Textarea id="court-description" name="description" required value={draft.description} onChange={(event) => setValue("description", event.target.value)} placeholder="Describí formato, superficie y experiencia de juego." aria-invalid={!!errors.description} aria-describedby={errors.description ? "court-description-error" : "court-description-help"} /><FieldDescription id="court-description-help">Preparada para reutilizarse en el detalle público.</FieldDescription>{errors.description ? <FieldError id="court-description-error">{errors.description}</FieldError> : null}</Field>
            </FormGrid></FieldGroup>
          </FormSection>

          <FormSection title="Servicios y características" description="Separá instalaciones disponibles de cualidades propias de la cancha.">
            <div className="grid gap-6 md:grid-cols-2">
              <FieldSet><FieldLegend>Servicios</FieldLegend><FieldGroup data-slot="checkbox-group">{COURT_SERVICES.map((item) => { const id = `service-${item.value.toLowerCase()}`; return <Field key={item.value} orientation="horizontal"><Checkbox id={id} checked={draft.services.includes(item.value)} onCheckedChange={(checked) => toggleService(item.value, checked)} /><FieldLabel htmlFor={id}>{item.label}</FieldLabel></Field>; })}</FieldGroup></FieldSet>
              <FieldSet><FieldLegend>Características</FieldLegend><FieldGroup data-slot="checkbox-group">{COURT_FEATURES.map((item) => { const id = `feature-${item.value.toLowerCase()}`; return <Field key={item.value} orientation="horizontal"><Checkbox id={id} checked={draft.features.includes(item.value)} onCheckedChange={(checked) => toggleFeature(item.value, checked)} /><FieldLabel htmlFor={id}>{item.label}</FieldLabel></Field>; })}</FieldGroup></FieldSet>
            </div>
          </FormSection>

          <FormSection title="Horarios semanales" description="Definí un único rango de reserva por día. Los días cerrados ignoran sus horas."><WeeklySchedule value={draft.weeklySchedule} errors={errors} onChange={(schedule) => setValue("weeklySchedule", schedule)} /></FormSection>
          <FormSection title="Imágenes" description="Galería simulada, sin storage ni carga de archivos real."><CourtImageManager images={draft.images} courtName={draft.name} onChange={(images) => setValue("images", images)} /></FormSection>
          {!isNew ? <FormSection title="Bloqueos" description="Cierres puntuales independientes del estado general de la cancha."><CourtBlocks courtId={courtId} /></FormSection> : null}
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <FormSection title="Configuración del turno" description="Precio y duración utilizados por el flujo de reservas.">
            <FieldGroup>
              <Field data-invalid={!!errors.pricePerSlot}><FieldLabel htmlFor="court-price">Precio por turno</FieldLabel><Input id="court-price" name="pricePerSlot" type="number" min="1" step="1000" inputMode="numeric" required value={draft.pricePerSlot} onChange={(event) => setValue("pricePerSlot", Number(event.target.value))} aria-invalid={!!errors.pricePerSlot} aria-describedby={errors.pricePerSlot ? "court-price-error" : "court-price-help"} /><FieldDescription id="court-price-help">Importe en pesos argentinos por turno completo.</FieldDescription>{errors.pricePerSlot ? <FieldError id="court-price-error">{errors.pricePerSlot}</FieldError> : null}</Field>
              <Field data-invalid={!!errors.slotMinutes}><FieldLabel htmlFor="court-duration">Duración</FieldLabel><Select items={slotItems} value={String(draft.slotMinutes)} onValueChange={(value) => value && setValue("slotMinutes", Number(value))}><SelectTrigger id="court-duration" aria-invalid={!!errors.slotMinutes}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{slotItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select>{errors.slotMinutes ? <FieldError>{errors.slotMinutes}</FieldError> : null}</Field>
            </FieldGroup>
          </FormSection>

          <FormSection title="Publicación y orden" description="Controlá el estado operativo y la posición en listados.">
            <FieldGroup>
              <Field><FieldLabel htmlFor="court-status">Estado</FieldLabel><Select items={COURT_STATUSES} value={draft.status} onValueChange={(value) => value && setValue("status", value as CourtStatus)}><SelectTrigger id="court-status"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{COURT_STATUSES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><FieldDescription>{statusDescription}</FieldDescription></Field>
              <Field data-invalid={!!errors.order}><FieldLabel htmlFor="court-order">Orden</FieldLabel><Input id="court-order" name="order" type="number" min="1" step="1" inputMode="numeric" required value={draft.order} onChange={(event) => setValue("order", Number(event.target.value))} aria-invalid={!!errors.order} aria-describedby={errors.order ? "court-order-error" : "court-order-help"} /><FieldDescription id="court-order-help">Un número menor aparece antes en el listado.</FieldDescription>{errors.order ? <FieldError id="court-order-error">{errors.order}</FieldError> : null}</Field>
              <Field orientation="horizontal"><Checkbox id="court-featured" checked={draft.isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} /><div><FieldLabel htmlFor="court-featured">Destacar cancha</FieldLabel><FieldDescription>Permite priorizarla en selecciones destacadas del prototipo.</FieldDescription></div></Field>
            </FieldGroup>
          </FormSection>
        </div>

        <div className="xl:col-span-12"><FormActions><Button variant="outline" render={<Link href="/admin/canchas" />} nativeButton={false}>Volver</Button><Button type="submit" disabled={saving}><SaveIcon data-icon="inline-start" aria-hidden="true" />{saving ? "Guardando..." : isNew ? "Crear cancha" : "Guardar cambios"}</Button></FormActions></div>
      </form>
    </div>
  );
}

export { CourtForm };

"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ProductVariant } from "@/types";

function VariantEditor({ variants, onChange }: { variants: ProductVariant[]; onChange: (variants: ProductVariant[]) => void }) {
  const update = (index: number, value: ProductVariant) => onChange(variants.map((item, itemIndex) => itemIndex === index ? value : item));
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= variants.length) return; const copy = [...variants]; [copy[index], copy[target]] = [copy[target], copy[index]]; onChange(copy); };
  return <div className="flex flex-col gap-4">{variants.length ? <ol className="flex flex-col gap-3" aria-label="Variantes del producto">{variants.map((variant, index) => <li key={index} className="grid items-end gap-3 rounded-lg border border-border bg-background-subtle p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"><Field><FieldLabel htmlFor={`variant-${index}`}>Variante {index + 1}</FieldLabel><Input id={`variant-${index}`} value={variant.label} onChange={(event) => update(index, { ...variant, label: event.target.value })} placeholder="Ej. Talle M" /></Field><Field orientation="horizontal" className="min-h-10"><Switch id={`variant-available-${index}`} aria-label={`Disponibilidad de variante ${index + 1}`} checked={variant.available} onCheckedChange={(checked) => update(index, { ...variant, available: checked })} /><FieldContent><FieldLabel htmlFor={`variant-available-${index}`}>Disponible</FieldLabel></FieldContent></Field><div className="flex gap-1"><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover variante ${index + 1} hacia arriba`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUpIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Mover variante ${index + 1} hacia abajo`} disabled={index === variants.length - 1} onClick={() => move(index, 1)}><ArrowDownIcon aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label={`Eliminar variante ${index + 1}`} onClick={() => onChange(variants.filter((_, itemIndex) => itemIndex !== index))}><Trash2Icon aria-hidden="true" /></Button></div></li>)}</ol> : <p className="rounded-lg border border-dashed border-border-strong bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">Este producto no tiene variantes. Es un caso válido.</p>}<div><Button type="button" variant="outline" size="sm" onClick={() => onChange([...variants, { label: "", available: true }])}><PlusIcon data-icon="inline-start" aria-hidden="true" />Agregar variante</Button></div><FieldDescription>La disponibilidad global del producto prevalece sobre la de cada variante.</FieldDescription></div>;
}

export { VariantEditor };

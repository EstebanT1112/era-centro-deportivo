"use client"

import type { ChangeEvent } from "react"
import { ImagePlusIcon, Trash2Icon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

import { TeacherAvatar } from "./teacher-avatar"

function TeacherImageField({ name, image, onChange }: { name: string; image?: string; onChange: (image?: string) => void }) {
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") onChange(reader.result)
    }, { once: true })
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  return (
    <Field>
      <FieldLabel htmlFor="teacher-image">Foto de perfil</FieldLabel>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted p-4 sm:flex-row sm:items-center">
        <TeacherAvatar name={name} image={image} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <p className="font-medium text-foreground">{image ? "Foto cargada" : "Avatar con iniciales"}</p>
            <FieldDescription>Este prototipo mantiene la imagen solo durante la sesión actual.</FieldDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30")}>
              <ImagePlusIcon data-icon="inline-start" aria-hidden="true" />
              {image ? "Reemplazar foto" : "Agregar foto"}
              <input id="teacher-image" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            </label>
            {image ? <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}><Trash2Icon data-icon="inline-start" aria-hidden="true" />Quitar foto</Button> : null}
          </div>
        </div>
      </div>
    </Field>
  )
}

export { TeacherImageField }

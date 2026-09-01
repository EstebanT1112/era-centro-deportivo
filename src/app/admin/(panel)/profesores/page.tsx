import type { Metadata } from "next"
import Link from "next/link"
import { UserPlusIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { TeachersList } from "@/components/admin/teachers/teachers-list"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Profesores" }

export default function AdminTeachersPage() {
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Profesores"
        description="Gestioná identidad, contacto y disponibilidad. Las asignaciones se mantienen desde Disciplinas."
        actions={<Button render={<Link href="/admin/profesores/nuevo" />} nativeButton={false}><UserPlusIcon data-icon="inline-start" aria-hidden="true" />Nuevo profesor</Button>}
      />
      <TeachersList />
    </div>
  )
}

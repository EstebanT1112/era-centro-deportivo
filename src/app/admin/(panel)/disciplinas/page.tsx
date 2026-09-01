import type { Metadata } from "next"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { DisciplinesList } from "@/components/admin/disciplines/disciplines-list"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Disciplinas" }

export default function AdminDisciplinesPage() {
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Disciplinas"
        description="Gestioná las actividades deportivas, sus categorías, horarios y responsables."
        actions={<Button render={<Link href="/admin/disciplinas/nueva" />} nativeButton={false}><PlusIcon data-icon="inline-start" aria-hidden="true" />Nueva disciplina</Button>}
      />
      <DisciplinesList />
    </div>
  )
}

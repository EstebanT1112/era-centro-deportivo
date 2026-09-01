import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DisciplineForm } from "@/components/admin/disciplines/discipline-form"
import { getDisciplineById } from "@/lib/disciplines"
import { disciplines } from "@/mocks"

export function generateStaticParams() {
  return [...disciplines.map((discipline) => ({ id: discipline.id })), { id: "nueva" }]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const discipline = getDisciplineById(id)

  return { title: id === "nueva" ? "Nueva disciplina" : discipline ? `Editar ${discipline.name}` : id.startsWith("discipline-session-") ? "Editar disciplina" : "Disciplina no encontrada" }
}

export default async function AdminDisciplineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "nueva"
  const discipline = isNew ? undefined : getDisciplineById(id)
  const isSessionDiscipline = id.startsWith("discipline-session-")

  if (!isNew && !discipline && !isSessionDiscipline) notFound()

  return <DisciplineForm key={id} disciplineId={id} />
}

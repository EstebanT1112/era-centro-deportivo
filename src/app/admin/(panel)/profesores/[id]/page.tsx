import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TeacherForm } from "@/components/admin/teachers/teacher-form"
import { getTeacherById } from "@/lib/teachers"
import { teachers } from "@/mocks"

export function generateStaticParams() {
  return [...teachers.map((teacher) => ({ id: teacher.id })), { id: "nuevo" }]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const teacher = getTeacherById(id)

  return { title: id === "nuevo" ? "Nuevo profesor" : teacher ? `Editar ${teacher.name}` : id.startsWith("teacher-session-") ? "Editar profesor" : "Profesor no encontrado" }
}

export default async function AdminTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "nuevo"
  const teacher = isNew ? undefined : getTeacherById(id)
  const isSessionTeacher = id.startsWith("teacher-session-")

  if (!isNew && !teacher && !isSessionTeacher) notFound()

  return <TeacherForm teacherId={id} />
}

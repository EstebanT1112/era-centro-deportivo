import type { Discipline, Teacher } from "@/types"

import { getTeacherAssignments } from "./teachers"
import { normalizeWhatsAppPhone } from "./whatsapp"

export type TeacherDraft = Omit<Teacher, "id">
export type TeacherFormErrors = Partial<Record<keyof TeacherDraft, string>>

export interface TeacherFilters {
  query: string
  status: "all" | "active" | "inactive"
  assignments: "all" | "assigned" | "unassigned"
}

export function cloneTeacher(teacher: Teacher): Teacher {
  return { ...teacher }
}

export function createEmptyTeacher(): TeacherDraft {
  return {
    name: "",
    phone: "",
    email: "",
    image: undefined,
    bio: "",
    isActive: true,
  }
}

export function normalizeTeacherDraft(draft: TeacherDraft): TeacherDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    phone: normalizeWhatsAppPhone(draft.phone),
    email: draft.email?.trim().toLowerCase() || undefined,
    image: draft.image?.trim() || undefined,
    bio: draft.bio?.trim() || undefined,
  }
}

export function validateTeacher(draft: TeacherDraft): TeacherFormErrors {
  const errors: TeacherFormErrors = {}
  const phone = normalizeWhatsAppPhone(draft.phone)

  if (!draft.name.trim()) errors.name = "Ingresá el nombre del profesor."
  if (!phone) errors.phone = "Ingresá un teléfono de contacto."
  else if (phone.length < 10 || phone.length > 15) errors.phone = "Ingresá entre 10 y 15 dígitos, incluyendo código de país y área."
  if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = "Ingresá un email válido."

  return errors
}

export function formatPhoneForDisplay(phone: string) {
  const digits = normalizeWhatsAppPhone(phone)
  if (!digits) return ""
  if (digits.startsWith("549") && digits.length === 13) {
    return `+54 9 ${digits.slice(3, 6)} ${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  if (digits.startsWith("54") && digits.length === 12) {
    return `+54 ${digits.slice(2, 5)} ${digits.slice(5, 8)}-${digits.slice(8)}`
  }
  return `+${digits.replace(/(\d{3})(?=\d)/g, "$1 ")}`
}

function getPhoneSearchTerms(value: string) {
  const digits = normalizeWhatsAppPhone(value)
  if (!digits) return []

  return [...new Set([
    digits,
    digits.startsWith("0") ? digits.slice(1) : digits,
    digits.startsWith("549") ? digits.slice(3) : digits,
    digits.startsWith("54") ? digits.slice(2) : digits,
  ].filter(Boolean))]
}

export function filterTeachers(
  teachers: readonly Teacher[],
  disciplines: readonly Discipline[],
  filters: TeacherFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase("es-AR")
  const phoneSearchTerms = getPhoneSearchTerms(filters.query)

  return teachers
    .filter((teacher) => {
      const textMatch = `${teacher.name} ${teacher.email ?? ""}`.toLocaleLowerCase("es-AR").includes(query)
      const normalizedPhone = normalizeWhatsAppPhone(teacher.phone)
      const phoneMatch = phoneSearchTerms.some((term) => normalizedPhone.includes(term))
      const assignmentCount = getTeacherAssignments(teacher.id, disciplines).length

      return (
        (!query || textMatch || phoneMatch) &&
        (filters.status === "all" || (filters.status === "active" ? teacher.isActive : !teacher.isActive)) &&
        (filters.assignments === "all" || (filters.assignments === "assigned" ? assignmentCount > 0 : assignmentCount === 0))
      )
    })
    .toSorted((a, b) => a.name.localeCompare(b.name, "es"))
}

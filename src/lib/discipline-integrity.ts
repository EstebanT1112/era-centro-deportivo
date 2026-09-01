import type { Discipline, Teacher } from "@/types"

import { normalizeWhatsAppPhone } from "./whatsapp"

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function findDuplicates(values: readonly string[]) {
  const seen = new Set<string>()
  return [...new Set(values.filter((value) => seen.size === seen.add(value).size))]
}

function hasSequentialOrders(values: readonly number[]) {
  return [...values].toSorted((a, b) => a - b).every((value, index) => value === index + 1)
}

export function validateDisciplineMockIntegrity(disciplines: readonly Discipline[], teachers: readonly Teacher[]) {
  const issues: string[] = []
  const teacherIds = new Set(teachers.map((teacher) => teacher.id))
  const disciplineIds = disciplines.map((discipline) => discipline.id)
  const slugs = disciplines.map((discipline) => discipline.slug)
  const nestedIds = disciplines.flatMap((discipline) => discipline.categories.flatMap((category) => [category.id, ...category.schedules.map((item) => item.id)]))
  const allIds = [...teachers.map((teacher) => teacher.id), ...disciplineIds, ...nestedIds]

  for (const duplicate of findDuplicates(allIds)) issues.push(`ID duplicado: ${duplicate}`)
  for (const duplicate of findDuplicates(slugs)) issues.push(`Slug duplicado: ${duplicate}`)
  for (const slug of slugs.filter((value) => !slugPattern.test(value))) issues.push(`Slug inválido: ${slug}`)
  if (!hasSequentialOrders(disciplines.map((discipline) => discipline.order))) issues.push("El orden de disciplinas no es secuencial.")

  for (const teacher of teachers) {
    const normalizedPhone = normalizeWhatsAppPhone(teacher.phone)
    if (teacher.phone !== normalizedPhone || normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      issues.push(`Teléfono inválido o sin normalizar en ${teacher.id}.`)
    }
    if (teacher.email && !emailPattern.test(teacher.email)) issues.push(`Email inválido en ${teacher.id}.`)
  }

  for (const discipline of disciplines) {
    if (!hasSequentialOrders(discipline.categories.map((category) => category.order))) {
      issues.push(`El orden de categorías no es secuencial en ${discipline.id}.`)
    }

    for (const teacherId of discipline.responsibleTeacherIds) {
      if (!teacherIds.has(teacherId)) issues.push(`Profesor inexistente ${teacherId} en ${discipline.id}.`)
    }
    for (const duplicate of findDuplicates(discipline.responsibleTeacherIds)) {
      issues.push(`Responsable duplicado ${duplicate} en ${discipline.id}.`)
    }

    for (const category of discipline.categories) {
      for (const duplicate of findDuplicates(category.teacherIds)) {
        issues.push(`Profesor duplicado ${duplicate} en ${category.id}.`)
      }
      for (const teacherId of category.teacherIds) {
        if (!teacherIds.has(teacherId)) issues.push(`Profesor inexistente ${teacherId} en ${category.id}.`)
      }

      const scheduleSignatures = category.schedules.map((item) => `${item.weekday}-${item.startTime}-${item.endTime}`)
      for (const duplicate of findDuplicates(scheduleSignatures)) {
        issues.push(`Horario duplicado ${duplicate} en ${category.id}.`)
      }
      for (const item of category.schedules) {
        if (!timePattern.test(item.startTime) || !timePattern.test(item.endTime) || item.startTime >= item.endTime) {
          issues.push(`Horario inválido ${item.id}: ${item.startTime}-${item.endTime}.`)
        }
        if (item.weekday < 0 || item.weekday > 6) issues.push(`Día inválido en ${item.id}.`)
      }
    }
  }

  return { isValid: issues.length === 0, issues }
}

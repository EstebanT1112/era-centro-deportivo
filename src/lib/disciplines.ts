import { disciplines } from "@/mocks/disciplines"
import { WEEKDAY_LABELS, WEEKDAYS } from "@/constants/domain"
import type { Discipline, DisciplineSchedule, Weekday } from "@/types"

import { buildWhatsAppUrl } from "./whatsapp"

export function getDisciplineById(id: string) {
  return disciplines.find((discipline) => discipline.id === id)
}

export function getDisciplineBySlug(slug: string) {
  return disciplines.find((discipline) => discipline.slug === slug && discipline.isVisible)
}

export function getVisibleDisciplines() {
  return disciplines.filter((discipline) => discipline.isVisible).toSorted((a, b) => a.order - b.order)
}

export function getFeaturedDisciplines() {
  return disciplines
    .filter((discipline) => discipline.isVisible && discipline.isFeatured)
    .toSorted((a, b) => a.order - b.order)
}

export function getActiveDisciplineCategories(discipline: Discipline) {
  return discipline.categories.filter((category) => category.isActive).toSorted((a, b) => a.order - b.order)
}

export function getDisciplineCategoryLocation(discipline: Discipline, categoryId: string) {
  return discipline.categories.find((category) => category.id === categoryId)?.location ?? discipline.location
}

export function getWeekdayLabel(weekday: Weekday) {
  return WEEKDAY_LABELS[weekday]
}

export function getSortedDisciplineSchedules(schedules: readonly DisciplineSchedule[]) {
  return schedules.toSorted((a, b) => {
    const dayDifference = WEEKDAYS.findIndex((day) => day.value === a.weekday)
      - WEEKDAYS.findIndex((day) => day.value === b.weekday)

    return dayDifference || a.startTime.localeCompare(b.startTime)
  })
}

export function getDisciplineGalleryImages(discipline: Discipline) {
  return [...new Set([discipline.coverImage, ...discipline.images].filter(Boolean))]
}

export function buildDisciplineWhatsAppMessage({
  disciplineName,
  categoryName,
}: {
  disciplineName: string
  categoryName?: string
}) {
  return categoryName
    ? `Hola, quería consultar por ${disciplineName} ${categoryName} del club.`
    : `Hola, quería consultar por la disciplina de ${disciplineName} del club.`
}

export function buildDisciplineWhatsAppUrl({
  phone,
  disciplineName,
  categoryName,
}: {
  phone: string
  disciplineName: string
  categoryName?: string
}) {
  return buildWhatsAppUrl(phone, buildDisciplineWhatsAppMessage({ disciplineName, categoryName }))
}

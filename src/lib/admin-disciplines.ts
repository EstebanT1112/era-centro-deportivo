import { SITE_IMAGES } from "@/constants/assets"
import { WEEKDAYS } from "@/constants/domain"
import type { Discipline, DisciplineCategory, DisciplineSchedule, Teacher, Weekday } from "@/types"

export type DisciplineDraft = Omit<Discipline, "id">

export interface DisciplineFilters {
  query: string
  visibility: "all" | "visible" | "hidden"
  featured: "all" | "featured" | "not-featured"
}

export type DisciplineFormErrors = Record<string, string>

export const DISCIPLINE_IMAGE_OPTIONS = [
  SITE_IMAGES.disciplines.futbol,
  SITE_IMAGES.disciplines.hockey,
  SITE_IMAGES.disciplines.voley,
] as const

export function slugifyDisciplineName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function cloneDiscipline(discipline: Discipline): Discipline {
  return {
    ...discipline,
    images: [...discipline.images],
    responsibleTeacherIds: [...discipline.responsibleTeacherIds],
    categories: discipline.categories.map((category) => ({
      ...category,
      teacherIds: [...category.teacherIds],
      schedules: category.schedules.map((schedule) => ({ ...schedule })),
    })),
  }
}

export function createEmptyDiscipline(order: number): DisciplineDraft {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    coverImage: "",
    images: [],
    location: "",
    requirements: "",
    categories: [],
    responsibleTeacherIds: [],
    isVisible: false,
    isFeatured: false,
    order,
  }
}

export function createEmptyCategory(id: string, order: number): DisciplineCategory {
  return {
    id,
    name: "",
    ageRange: "",
    description: "",
    location: "",
    schedules: [],
    teacherIds: [],
    isActive: true,
    order,
  }
}

export function createEmptySchedule(id: string): DisciplineSchedule {
  return { id, weekday: 1, startTime: "18:00", endTime: "19:00" }
}

export function filterDisciplines(disciplines: Discipline[], filters: DisciplineFilters) {
  const query = filters.query.trim().toLocaleLowerCase("es-AR")

  return disciplines
    .filter((discipline) => {
      const haystack = `${discipline.name} ${discipline.shortDescription} ${discipline.description}`.toLocaleLowerCase("es-AR")
      return (
        (!query || haystack.includes(query)) &&
        (filters.visibility === "all" || (filters.visibility === "visible" ? discipline.isVisible : !discipline.isVisible)) &&
        (filters.featured === "all" || (filters.featured === "featured" ? discipline.isFeatured : !discipline.isFeatured))
      )
    })
    .toSorted((a, b) => a.order - b.order || a.name.localeCompare(b.name, "es"))
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function validateDiscipline(
  draft: DisciplineDraft,
  disciplines: readonly Discipline[],
  currentId?: string,
  teachers: readonly Teacher[] = [],
) {
  const errors: DisciplineFormErrors = {}
  if (!draft.name.trim()) errors.name = "Ingresá el nombre de la disciplina."
  if (!draft.slug.trim()) errors.slug = "El slug no puede quedar vacío."
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) errors.slug = "El slug debe usar minúsculas, números y guiones."
  else if (disciplines.some((item) => item.id !== currentId && item.slug === draft.slug)) errors.slug = "Ya existe una disciplina con este slug."
  if (!draft.shortDescription.trim()) errors.shortDescription = "Ingresá una descripción breve."
  if (!draft.description.trim()) errors.description = "Ingresá la descripción completa."
  if (!draft.coverImage.trim()) errors.coverImage = "Seleccioná una imagen de portada."
  if (!Number.isInteger(draft.order) || draft.order < 0) errors.order = "Ingresá un orden entero igual o mayor que 0."

  const teacherIds = new Set(teachers.map((teacher) => teacher.id))
  draft.responsibleTeacherIds.forEach((id) => {
    if (!teacherIds.has(id)) errors.responsibleTeacherIds = "Hay un responsable que ya no existe."
  })

  draft.categories.forEach((category, categoryIndex) => {
    const categoryPath = `categories.${categoryIndex}`
    if (!category.name.trim()) errors[`${categoryPath}.name`] = "Ingresá el nombre de la categoría."
    if (!Number.isInteger(category.order) || category.order < 0) errors[`${categoryPath}.order`] = "Ingresá un orden válido."
    category.teacherIds.forEach((id) => {
      if (!teacherIds.has(id)) errors[`${categoryPath}.teacherIds`] = "Hay un profesor asociado que ya no existe."
    })

    const exactSchedules = new Set<string>()
    category.schedules.forEach((schedule, scheduleIndex) => {
      const schedulePath = `${categoryPath}.schedules.${scheduleIndex}`
      if (![0, 1, 2, 3, 4, 5, 6].includes(schedule.weekday as number)) errors[`${schedulePath}.weekday`] = "Seleccioná un día válido."
      if (!isValidTime(schedule.startTime)) errors[`${schedulePath}.startTime`] = "Ingresá una hora de inicio válida."
      if (!isValidTime(schedule.endTime)) errors[`${schedulePath}.endTime`] = "Ingresá una hora de fin válida."
      if (isValidTime(schedule.startTime) && isValidTime(schedule.endTime) && schedule.startTime >= schedule.endTime) {
        errors[`${schedulePath}.endTime`] = "La hora de fin debe ser posterior a la hora de inicio."
      }
      const signature = `${schedule.weekday}-${schedule.startTime}-${schedule.endTime}`
      if (exactSchedules.has(signature)) errors[`${schedulePath}.duplicate`] = "Este horario está repetido."
      exactSchedules.add(signature)
    })
  })

  return errors
}

export function normalizeDisciplineDraft(draft: DisciplineDraft): DisciplineDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    slug: slugifyDisciplineName(draft.slug),
    shortDescription: draft.shortDescription.trim(),
    description: draft.description.trim(),
    location: draft.location?.trim() || undefined,
    requirements: draft.requirements?.trim() || undefined,
    images: [...new Set(draft.images.filter(Boolean))],
    responsibleTeacherIds: [...new Set(draft.responsibleTeacherIds)],
    categories: draft.categories.map((category, index) => ({
      ...category,
      name: category.name.trim(),
      ageRange: category.ageRange?.trim() || undefined,
      description: category.description?.trim() || undefined,
      location: category.location?.trim() || undefined,
      teacherIds: [...new Set(category.teacherIds)],
      order: index + 1,
      schedules: category.schedules
        .map((schedule) => ({ ...schedule, weekday: schedule.weekday as Weekday }))
        .toSorted((a, b) => {
          const dayDifference = WEEKDAYS.findIndex((day) => day.value === a.weekday) - WEEKDAYS.findIndex((day) => day.value === b.weekday)
          return dayDifference || a.startTime.localeCompare(b.startTime)
        }),
    })),
  }
}

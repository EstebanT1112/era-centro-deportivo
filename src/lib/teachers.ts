import { disciplines as initialDisciplines } from "@/mocks/disciplines"
import { teachers } from "@/mocks/teachers"
import type { Discipline, Teacher } from "@/types"

export interface TeacherAssignment {
  disciplineId: string
  disciplineName: string
  disciplineSlug: string
  disciplineIsVisible: boolean
  categoryId?: string
  categoryName?: string
  categoryIsActive?: boolean
  role: "responsible" | "category"
}

export function getTeacherById(id: string) {
  return teachers.find((teacher) => teacher.id === id)
}

export function getTeachersByIds(ids: readonly string[]) {
  const requestedIds = new Set(ids)
  return teachers.filter((teacher) => requestedIds.has(teacher.id))
}

export function getActiveTeachersByIds(ids: readonly string[]) {
  return getTeachersByIds(ids).filter((teacher) => teacher.isActive)
}

export function getActiveTeachers() {
  return teachers.filter((teacher) => teacher.isActive).toSorted((a, b) => a.name.localeCompare(b.name, "es"))
}

export function getTeacherAssignments(
  teacherId: string,
  disciplines: readonly Discipline[] = initialDisciplines,
): TeacherAssignment[] {
  return [...disciplines].toSorted((a, b) => a.order - b.order).flatMap((discipline) => {
    const assignments: TeacherAssignment[] = []

    if (discipline.responsibleTeacherIds.includes(teacherId)) {
      assignments.push({
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        disciplineSlug: discipline.slug,
        disciplineIsVisible: discipline.isVisible,
        role: "responsible",
      })
    }

    discipline.categories.forEach((category) => {
      if (!category.teacherIds.includes(teacherId)) return
      assignments.push({
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        disciplineSlug: discipline.slug,
        disciplineIsVisible: discipline.isVisible,
        categoryId: category.id,
        categoryName: category.name,
        categoryIsActive: category.isActive,
        role: "category",
      })
    })

    return assignments
  })
}

export function resolveTeachersByIds(ids: readonly string[], source: readonly Teacher[]) {
  const requestedIds = new Set(ids)
  return source.filter((teacher) => requestedIds.has(teacher.id))
}

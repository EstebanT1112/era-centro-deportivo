import type { Weekday } from "./schedule"

export interface DisciplineSchedule {
  id: string
  weekday: Weekday
  startTime: string
  endTime: string
}

export interface DisciplineCategory {
  id: string
  name: string
  ageRange?: string
  description?: string
  location?: string
  schedules: DisciplineSchedule[]
  teacherIds: string[]
  isActive: boolean
  order: number
}

export interface Discipline {
  id: string
  name: string
  slug: string
  shortDescription: string
  description: string
  coverImage: string
  images: string[]
  location?: string
  requirements?: string
  categories: DisciplineCategory[]
  responsibleTeacherIds: string[]
  isVisible: boolean
  isFeatured: boolean
  order: number
}

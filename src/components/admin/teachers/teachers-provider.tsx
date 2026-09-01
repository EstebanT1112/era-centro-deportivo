"use client"

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"

import { cloneTeacher, type TeacherDraft } from "@/lib/admin-teachers"
import { teachers as initialTeachers } from "@/mocks"
import type { Teacher } from "@/types"

interface TeachersContextValue {
  teachers: Teacher[]
  addTeacher: (draft: TeacherDraft) => Teacher
  updateTeacher: (id: string, draft: TeacherDraft) => Teacher | undefined
}

const TeachersContext = createContext<TeachersContextValue | null>(null)

function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState(() => initialTeachers.map(cloneTeacher))
  const nextId = useRef(1)

  const value = useMemo<TeachersContextValue>(() => ({
    teachers,
    addTeacher(draft) {
      const teacher = cloneTeacher({ ...draft, id: `teacher-session-${nextId.current++}` })
      setTeachers((items) => [...items, teacher])
      return teacher
    },
    updateTeacher(id, draft) {
      const current = teachers.find((teacher) => teacher.id === id)
      if (!current) return undefined
      const updated = cloneTeacher({ ...draft, id })
      setTeachers((items) => items.map((teacher) => teacher.id === id ? updated : teacher))
      return updated
    },
  }), [teachers])

  return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>
}

function useAdminTeachers() {
  const context = useContext(TeachersContext)
  if (!context) throw new Error("useAdminTeachers debe usarse dentro de TeachersProvider")
  return context
}

export { TeachersProvider, useAdminTeachers }

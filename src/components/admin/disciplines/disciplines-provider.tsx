"use client"

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"

import { cloneDiscipline, type DisciplineDraft } from "@/lib/admin-disciplines"
import { disciplines as initialDisciplines } from "@/mocks"
import type { Discipline } from "@/types"

interface DisciplinesContextValue {
  disciplines: Discipline[]
  addDiscipline: (draft: DisciplineDraft) => Discipline
  updateDiscipline: (id: string, draft: DisciplineDraft) => Discipline | undefined
}

const DisciplinesContext = createContext<DisciplinesContextValue | null>(null)

function DisciplinesProvider({ children }: { children: ReactNode }) {
  const [disciplines, setDisciplines] = useState(() => initialDisciplines.map(cloneDiscipline))
  const nextId = useRef(1)

  const value = useMemo<DisciplinesContextValue>(() => ({
    disciplines,
    addDiscipline(draft) {
      const discipline = cloneDiscipline({ ...draft, id: `discipline-session-${nextId.current++}` })
      setDisciplines((items) => [...items, discipline])
      return discipline
    },
    updateDiscipline(id, draft) {
      const current = disciplines.find((discipline) => discipline.id === id)
      if (!current) return undefined
      const updated = cloneDiscipline({ ...draft, id })
      setDisciplines((items) => items.map((discipline) => discipline.id === id ? updated : discipline))
      return updated
    },
  }), [disciplines])

  return <DisciplinesContext.Provider value={value}>{children}</DisciplinesContext.Provider>
}

function useAdminDisciplines() {
  const context = useContext(DisciplinesContext)
  if (!context) throw new Error("useAdminDisciplines debe usarse dentro de DisciplinesProvider")
  return context
}

export { DisciplinesProvider, useAdminDisciplines }

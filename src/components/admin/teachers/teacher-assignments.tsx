import Link from "next/link"
import { EyeOffIcon, Layers3Icon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeacherAssignment } from "@/lib/teachers"

function TeacherAssignments({ assignments }: { assignments: TeacherAssignment[] }) {
  if (!assignments.length) {
    return (
      <EmptyState
        icon={Layers3Icon}
        title="Este profesor todavía no tiene asignaciones"
        description="Las relaciones se gestionan desde cada disciplina para mantener una única fuente de verdad."
        titleAs="h2"
        action={<Button variant="outline" render={<Link href="/admin/disciplinas" />} nativeButton={false}>Ir a Disciplinas</Button>}
        className="py-8"
      />
    )
  }

  const groups = assignments.reduce<Map<string, TeacherAssignment[]>>((result, assignment) => {
    const current = result.get(assignment.disciplineId) ?? []
    current.push(assignment)
    result.set(assignment.disciplineId, current)
    return result
  }, new Map())

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {[...groups.values()].map((group) => {
        const discipline = group[0]
        return (
          <Card key={discipline.disciplineId}>
            <CardHeader className="gap-2 border-b border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base"><h3>{discipline.disciplineName}</h3></CardTitle>
                  <CardDescription>{group.length} {group.length === 1 ? "asignación" : "asignaciones"}</CardDescription>
                </div>
                {!discipline.disciplineIsVisible ? <StatusBadge variant="neutral" icon={EyeOffIcon}>Disciplina oculta</StatusBadge> : null}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              <ul className="flex flex-col gap-2" aria-label={`Asignaciones en ${discipline.disciplineName}`}>
                {group.map((assignment) => (
                  <li key={`${assignment.role}-${assignment.categoryId ?? "general"}`} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2.5 text-sm">
                    <span className="font-medium">{assignment.role === "responsible" ? "Responsable general" : assignment.categoryName}</span>
                    {assignment.role === "responsible" ? <StatusBadge variant="info">Coordinación</StatusBadge> : assignment.categoryIsActive ? <StatusBadge variant="success">Categoría activa</StatusBadge> : <StatusBadge variant="warning">Categoría inactiva</StatusBadge>}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" render={<Link href={`/admin/disciplinas/${discipline.disciplineId}`} />} nativeButton={false}>Gestionar en Disciplina</Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { TeacherAssignments }

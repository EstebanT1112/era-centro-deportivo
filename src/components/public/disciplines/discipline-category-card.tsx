import { CalendarDaysIcon, Clock3Icon, MapPinIcon, UsersRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getDisciplineCategoryLocation,
  getSortedDisciplineSchedules,
  getWeekdayLabel,
} from "@/lib/disciplines"
import { getActiveTeachersByIds } from "@/lib/teachers"
import type { Discipline, DisciplineCategory } from "@/types"

import { TeacherCard } from "./teacher-card"

interface DisciplineCategoryCardProps {
  discipline: Discipline
  category: DisciplineCategory
}

function DisciplineCategoryCard({ discipline, category }: DisciplineCategoryCardProps) {
  const schedules = getSortedDisciplineSchedules(category.schedules)
  const teachers = getActiveTeachersByIds(category.teacherIds)
  const location = getDisciplineCategoryLocation(discipline, category.id)

  return (
    <Card className="[--card-spacing:--spacing(5)] md:[--card-spacing:--spacing(6)]">
      <CardHeader className="gap-3 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <UsersRoundIcon data-icon="inline-start" aria-hidden="true" />
            Categoría activa
          </Badge>
          {category.ageRange ? <Badge variant="outline">{category.ageRange}</Badge> : null}
        </div>
        <CardTitle>
          <h3 className="font-display text-h3 text-balance">{category.name}</h3>
        </CardTitle>
        {category.description ? (
          <p className="max-w-2xl text-sm text-pretty text-muted-foreground">{category.description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-5">
          <section aria-labelledby={`${category.id}-schedule-heading`}>
            <h4 id={`${category.id}-schedule-heading`} className="flex items-center gap-2 font-semibold text-foreground">
              <CalendarDaysIcon className="size-4 text-primary" aria-hidden="true" />
              Días y horarios
            </h4>
            {schedules.length ? (
              <dl className="mt-3 flex flex-col gap-2">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="grid grid-cols-[minmax(5.5rem,1fr)_auto] items-center gap-3 rounded-md bg-background-subtle px-3 py-2.5 text-sm">
                    <dt className="font-medium text-foreground">{getWeekdayLabel(schedule.weekday)}</dt>
                    <dd className="flex items-center gap-1.5 tabular-nums text-muted-foreground">
                      <Clock3Icon className="size-4" aria-hidden="true" />
                      <span className="sr-only">De </span>{schedule.startTime}<span aria-hidden="true">–</span><span className="sr-only"> a </span>{schedule.endTime}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Horarios a confirmar.</p>
            )}
          </section>

          {location ? (
            <div className="flex items-start gap-2.5 border-t border-border pt-4 text-sm">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground">Lugar de entrenamiento</p>
                <p className="mt-1 text-muted-foreground">{location}</p>
              </div>
            </div>
          ) : null}
        </div>

        <section aria-labelledby={`${category.id}-teachers-heading`}>
          <h4 id={`${category.id}-teachers-heading`} className="font-semibold text-foreground">
            {teachers.length === 1 ? "Profesor a cargo" : "Profesores a cargo"}
          </h4>
          {teachers.length ? (
            <div className="mt-3 flex flex-col gap-3">
              {teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  disciplineName={discipline.name}
                  categoryName={category.name}
                  compact
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Consultá al centro para conocer quién coordina esta categoría.</p>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

export { DisciplineCategoryCard }

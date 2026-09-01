"use client";

import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WEEKDAYS } from "@/constants/domain";
import type { CourtWeeklySchedule } from "@/types";

interface WeeklyScheduleProps {
  value: CourtWeeklySchedule[];
  errors: Record<string, string>;
  onChange: (schedule: CourtWeeklySchedule[]) => void;
}

function WeeklySchedule({ value, errors, onChange }: WeeklyScheduleProps) {
  function updateDay(weekday: number, patch: Partial<CourtWeeklySchedule>) {
    onChange(value.map((day) => day.weekday === weekday ? { ...day, ...patch } : day));
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Horarios semanales de la cancha</legend>
      {WEEKDAYS.map(({ value: weekday, label }) => {
        const day = value.find((item) => item.weekday === weekday)!;
        const error = errors[`schedule-${weekday}`];
        return (
          <div key={weekday} className="rounded-lg border border-border bg-background-subtle p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-[9rem_1fr_1fr] sm:items-end">
              <div className="flex min-h-10 items-center gap-3">
                <Switch id={`schedule-${weekday}-enabled`} checked={day.enabled} onCheckedChange={(checked) => updateDay(weekday, { enabled: checked })} aria-describedby={error ? `schedule-${weekday}-error` : undefined} />
                <label htmlFor={`schedule-${weekday}-enabled`} className="text-sm font-semibold">{label}<span className="block text-xs font-normal text-muted-foreground">{day.enabled ? "Activo" : "Cerrado"}</span></label>
              </div>
              <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor={`schedule-${weekday}-start`}>Desde<Input id={`schedule-${weekday}-start`} name={`schedule-${weekday}-start`} type="time" disabled={!day.enabled} value={day.startTime} onChange={(event) => updateDay(weekday, { startTime: event.target.value })} aria-invalid={!!error} aria-describedby={error ? `schedule-${weekday}-error` : undefined} /></label>
              <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor={`schedule-${weekday}-end`}>Hasta<Input id={`schedule-${weekday}-end`} name={`schedule-${weekday}-end`} type="time" disabled={!day.enabled} value={day.endTime} onChange={(event) => updateDay(weekday, { endTime: event.target.value })} aria-invalid={!!error} aria-describedby={error ? `schedule-${weekday}-error` : undefined} /></label>
            </div>
            {error ? <FieldError id={`schedule-${weekday}-error`} className="mt-2">{label}: {error}</FieldError> : null}
          </div>
        );
      })}
    </fieldset>
  );
}

export { WeeklySchedule };

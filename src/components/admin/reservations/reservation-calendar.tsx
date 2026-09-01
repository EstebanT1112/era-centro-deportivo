"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarPlusIcon, LockKeyholeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/shared/status-badge"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MOCK_CURRENT_DATE } from "@/constants/prototype"
import { courts } from "@/mocks"
import { getMockCourtAvailability } from "@/mocks/court-availability"
import { getReservationForSlot, getWeekDates, ADMIN_SCHEDULE_START_TIMES } from "@/lib/admin-reservations"
import { formatDate, formatShortDate } from "@/lib/formatters"
import { getReservationStatusPresentation } from "@/lib/status-presentations"
import { useAdminReservations } from "./reservations-provider"
import type { Court } from "@/types"

type CalendarView = "day" | "week"

function getSlotState(court: Court, date: string, time: string) {
  if (court.status !== "active") return "blocked" as const
  return getMockCourtAvailability(court, [date])[date]?.find((slot) => slot.startTime === time)?.status ?? "blocked"
}

function CalendarSlot({ court, date, time, compact = false }: { court: Court; date: string; time: string; compact?: boolean }) {
  const { reservations } = useAdminReservations()
  const reservation = getReservationForSlot(reservations, court.id, date, time)
  const status = getSlotState(court, date, time)

  if (reservation) {
    const presentation = getReservationStatusPresentation(reservation.status)
    return (
      <Link href={`/admin/reservas/${reservation.id}`} className="flex min-h-16 flex-col justify-center gap-1 rounded-md border border-primary/20 bg-primary/5 p-2 outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${time}, ${court.name}, reserva de ${reservation.customerName}, ${presentation.label}`}>
        <span className="truncate text-sm font-semibold">{reservation.customerName}</span>
        {!compact ? <StatusBadge variant={presentation.variant}>{presentation.label}</StatusBadge> : null}
      </Link>
    )
  }

  if (status === "blocked" || status === "occupied") {
    const label = status === "occupied" ? "Ocupada" : "Bloqueada"
    return (
      <div className="flex min-h-16 items-center gap-2 rounded-md border border-border bg-muted/70 p-2 text-sm text-muted-foreground" aria-label={`${time}, ${court.name}, ${label.toLocaleLowerCase("es-AR")}`}>
        <LockKeyholeIcon className="size-4 shrink-0" aria-hidden="true" /><span>{label}</span>
      </div>
    )
  }

  const href = `/admin/reservas/nueva?court=${court.slug}&date=${date}&time=${encodeURIComponent(time)}`
  return (
    <Link href={href} className="flex min-h-16 items-center justify-between gap-2 rounded-md border border-dashed border-border-strong p-2 text-sm font-medium text-muted-foreground outline-none hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${time}, ${court.name}, libre, crear reserva`}>
      <span>Libre</span><CalendarPlusIcon className="size-4" aria-hidden="true" />
    </Link>
  )
}

function WeekSummary({ dates, selectedDate, onSelect }: { dates: string[]; selectedDate: string; onSelect: (date: string) => void }) {
  const { reservations } = useAdminReservations()
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7" aria-label="Resumen semanal">
      {dates.map((date) => {
        const count = reservations.filter((reservation) => reservation.date === date && !["cancelled", "expired"].includes(reservation.status)).length
        return <Button key={date} variant={selectedDate === date ? "secondary" : "outline"} className="h-auto justify-start px-3 py-2 text-left" aria-pressed={selectedDate === date} onClick={() => onSelect(date)}>
          <span><span className="block font-semibold capitalize">{formatShortDate(date)}</span><span className="block text-xs font-normal text-muted-foreground">{count} {count === 1 ? "reserva" : "reservas"}</span></span>
        </Button>
      })}
    </div>
  )
}

function ReservationCalendar() {
  const [view, setView] = useState<CalendarView>("day")
  const [selectedDate, setSelectedDate] = useState(MOCK_CURRENT_DATE)
  const [mobileCourtId, setMobileCourtId] = useState(courts.find((court) => court.status === "active")?.id ?? courts[0].id)
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
  const mobileCourt = courts.find((court) => court.id === mobileCourtId) ?? courts[0]
  const courtItems = courts.map((court) => ({ label: court.name, value: court.id }))

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-end sm:justify-between sm:p-4">
          <div className="flex flex-col gap-1.5"><label htmlFor="calendar-date" className="text-sm font-medium">Fecha</label><Input id="calendar-date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="sm:w-44" /></div>
          <ToggleGroup value={[view]} onValueChange={(values) => values.at(-1) && setView(values.at(-1) as CalendarView)} variant="outline" spacing={0} aria-label="Vista del calendario">
            <ToggleGroupItem value="day">Día</ToggleGroupItem><ToggleGroupItem value="week">Semana</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {view === "week" ? <WeekSummary dates={weekDates} selectedDate={selectedDate} onSelect={setSelectedDate} /> : null}

      <Card>
        <CardHeader><CardTitle><h2 className="text-base">Ocupación del {formatDate(selectedDate)}</h2></CardTitle><CardDescription>Seleccioná una reserva para verla o un turno libre para iniciar el alta.</CardDescription></CardHeader>
        <CardContent className="p-0">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableCaption className="sr-only">Calendario por horario y cancha para {formatDate(selectedDate)}.</TableCaption>
              <TableHeader><TableRow><TableHead scope="col" className="w-20">Hora</TableHead>{courts.map((court) => <TableHead scope="col" key={court.id} className="min-w-44">{court.name}</TableHead>)}</TableRow></TableHeader>
              <TableBody>{ADMIN_SCHEDULE_START_TIMES.map((time) => <TableRow key={time}>
                <TableHead scope="row" className="align-top font-semibold tabular-nums">{time}</TableHead>
                {courts.map((court) => <TableCell key={court.id} className="p-1.5"><CalendarSlot court={court} date={selectedDate} time={time} /></TableCell>)}
              </TableRow>)}</TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 p-4 md:hidden">
            <div className="flex flex-col gap-1.5"><label className="text-sm font-medium" htmlFor="mobile-court">Cancha</label>
              <Select items={courtItems} value={mobileCourtId} onValueChange={(value) => value && setMobileCourtId(value)}>
                <SelectTrigger id="mobile-court"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{courtItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </div>
            <ol className="flex flex-col gap-2" aria-label={`Horarios de ${mobileCourt.name}`}>
              {ADMIN_SCHEDULE_START_TIMES.map((time) => <li key={time} className="grid grid-cols-[3.5rem_1fr] items-stretch gap-2"><time className="pt-3 text-sm font-semibold tabular-nums">{time}</time><CalendarSlot court={mobileCourt} date={selectedDate} time={time} compact /></li>)}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ReservationCalendar }

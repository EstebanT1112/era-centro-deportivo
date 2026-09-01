import Link from "next/link"
import { CheckCircle2Icon, ChevronRightIcon, TriangleAlertIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourtStatusPresentation } from "@/lib/status-presentations"
import type { Court } from "@/types"

function CourtAlerts({ courts }: { courts: readonly Court[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle><h2>Alertas de canchas</h2></CardTitle>
        <CardDescription>Estados que requieren atención operativa.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {courts.length ? (
          <ul className="divide-y divide-border">
            {courts.map((court) => {
              const status = getCourtStatusPresentation(court.status)
              return (
                <li key={court.id} className="flex items-start gap-3 px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                    <TriangleAlertIcon aria-hidden="true" className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{court.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                      <span className="text-xs text-pretty text-muted-foreground">{court.status === "maintenance" ? "Revisar disponibilidad antes de asignar turnos." : "No admite nuevas reservas."}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" render={<Link href={`/admin/canchas/${court.id}`} aria-label={`Gestionar ${court.name}`} />} nativeButton={false}>
                    <ChevronRightIcon aria-hidden="true" />
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState icon={CheckCircle2Icon} title="Todas las canchas están operativas" description="No hay alertas que requieran atención." className="min-h-48" titleAs="h3" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { CourtAlerts }

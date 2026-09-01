"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CourtStep } from "@/features/reservations/components/steps/court-step"
import { CustomerStep } from "@/features/reservations/components/steps/customer-step"
import { PaymentStatusStep } from "@/features/reservations/components/steps/payment-status-step"
import { ScheduleStep } from "@/features/reservations/components/steps/schedule-step"
import { SuccessStep } from "@/features/reservations/components/steps/success-step"
import { SummaryStep } from "@/features/reservations/components/steps/summary-step"
import { ReservationProgress } from "@/features/reservations/components/reservation-progress"
import { ReservationSummary } from "@/features/reservations/components/reservation-summary"
import { ReservationTimer } from "@/features/reservations/components/reservation-timer"
import {
  EMPTY_RESERVATION_DRAFT,
  type CompletedReservation,
  type ReservationDraft,
  type ReservationStep,
} from "@/features/reservations/types"
import { getMockCourtAvailability, MOCK_BOOKING_DATES } from "@/mocks/court-availability"
import { calculateDeposit } from "@/config/reservations"
import type { Court, CourtTimeSlot } from "@/types"

const stepContent = {
  court: {
    title: "Elegí la cancha",
    description: "Compará las opciones disponibles y seleccioná dónde querés jugar.",
  },
  schedule: {
    title: "Elegí fecha y horario",
    description: "Los estados de disponibilidad son simulados para este prototipo.",
  },
  customer: {
    title: "Completá tus datos",
    description: "Necesitamos una forma de identificar la reserva y comunicarnos con vos.",
  },
  summary: {
    title: "Revisá antes de pagar",
    description: "Confirmá el turno, tus datos y el importe de la seña.",
  },
  redirect: {
    title: "Procesando la seña",
    description: "Esta redirección es una simulación local, sin conexión con Mercado Pago.",
  },
  verification: {
    title: "Procesando la seña",
    description: "Estamos comprobando el resultado mock del pago.",
  },
  success: {
    title: "Reserva confirmada",
    description: "El flujo visual terminó correctamente.",
  },
} satisfies Record<ReservationStep, { title: string; description: string }>

function createReservationCode(draft: ReservationDraft) {
  const source = `${draft.courtId}-${draft.date}-${draft.time}-${draft.phone}`
  let hash = 0
  for (const character of source) hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  return `RES-${hash.toString(16).toUpperCase().padStart(5, "0").slice(-5)}`
}

interface ReservationWizardProps {
  courts: Court[]
  initialDraft: ReservationDraft
}

function ReservationWizard({ courts, initialDraft }: ReservationWizardProps) {
  const [draft, setDraft] = useState<ReservationDraft>({
    ...EMPTY_RESERVATION_DRAFT,
    ...initialDraft,
  })
  const [step, setStep] = useState<ReservationStep>(initialDraft.courtId ? "schedule" : "court")
  const [direction, setDirection] = useState(1)
  const [result, setResult] = useState<CompletedReservation | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const reduceMotion = useReducedMotion()

  const court = courts.find((item) => item.id === draft.courtId)
  const availability = useMemo(
    () => (court ? getMockCourtAvailability(court) : {}),
    [court]
  )
  const slots = draft.date ? availability[draft.date] ?? [] : []
  const selectedSlot = slots.find((slot) => slot.startTime === draft.time)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const navigate = useCallback((nextStep: ReservationStep, nextDirection = 1) => {
    setDirection(nextDirection)
    setStep(nextStep)
  }, [])

  const handlePaymentRedirected = useCallback(() => {
    navigate("verification")
  }, [navigate])

  const handlePaymentVerified = useCallback(() => {
    if (!court || !selectedSlot || !draft.date) return

    const deposit = calculateDeposit(court.pricePerSlot)
    setResult({
      reservation: {
        id: `reservation-${createReservationCode(draft).toLowerCase()}`,
        code: createReservationCode(draft),
        courtId: court.id,
        customerName: `${draft.firstName.trim()} ${draft.lastName.trim()}`,
        customerPhone: draft.phone.trim(),
        date: draft.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: "confirmed",
        totalAmount: court.pricePerSlot,
        depositAmount: deposit,
        paidBalance: 0,
        paymentStatus: "approved",
      },
      court,
      slot: selectedSlot,
      customer: {
        firstName: draft.firstName,
        lastName: draft.lastName,
        phone: draft.phone,
        email: draft.email,
        playerCount: draft.playerCount,
        notes: draft.notes,
      },
    })
    navigate("success")
  }, [court, draft, navigate, selectedSlot])

  function handleCourtSelect(selectedCourt: Court) {
    setDraft((current) => ({
      ...current,
      courtId: selectedCourt.id,
      date: undefined,
      time: undefined,
    }))
  }

  function handleDateChange(date: string) {
    setDraft((current) => ({ ...current, date, time: undefined }))
  }

  function handleTimeChange(slot: CourtTimeSlot) {
    setDraft((current) => ({ ...current, time: slot.startTime }))
  }

  const currentContent = stepContent[step]
  const showTimer = Boolean(selectedSlot) && !["redirect", "verification", "success"].includes(step)
  const showSidebar = step !== "success"

  let stepBody: React.ReactNode = null

  if (step === "court") {
    stepBody = (
      <CourtStep
        courts={courts}
        selectedCourtId={draft.courtId}
        onSelect={handleCourtSelect}
        onContinue={() => navigate("schedule")}
      />
    )
  }

  if (step === "schedule" && court) {
    stepBody = (
      <ScheduleStep
        dates={[...MOCK_BOOKING_DATES]}
        selectedDate={draft.date}
        selectedTime={draft.time}
        slots={slots}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onBack={() => navigate("court", -1)}
        onContinue={() => navigate("customer")}
      />
    )
  }

  if (step === "customer") {
    stepBody = (
      <CustomerStep
        draft={draft}
        onChange={setDraft}
        onBack={() => navigate("schedule", -1)}
        onContinue={() => navigate("summary")}
      />
    )
  }

  if (step === "summary" && court && selectedSlot) {
    stepBody = (
      <SummaryStep
        draft={draft}
        court={court}
        slot={selectedSlot}
        onEdit={(target) => navigate(target, -1)}
        onBack={() => navigate("customer", -1)}
        onPay={() => navigate("redirect")}
      />
    )
  }

  if (step === "redirect") {
    stepBody = <PaymentStatusStep mode="redirect" onComplete={handlePaymentRedirected} />
  }

  if (step === "verification") {
    stepBody = <PaymentStatusStep mode="verification" onComplete={handlePaymentVerified} />
  }

  if (step === "success" && result) {
    stepBody = <SuccessStep result={result} />
  }

  return (
    <div className="flex flex-col gap-7">
      <ReservationProgress step={step} />
      {showTimer ? (
        <ReservationTimer key={`${draft.courtId}-${draft.date}-${draft.time}`} />
      ) : null}

      {showSidebar && court ? (
        <div className="lg:hidden">
          <ReservationSummary draft={draft} court={court} slot={selectedSlot} compact />
        </div>
      ) : null}

      <div className={showSidebar ? "grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem]" : "mx-auto w-full max-w-4xl"}>
        <Card className="min-w-0">
          <CardHeader className="border-b border-border pb-5">
            <CardTitle>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-h2 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {currentContent.title}
              </h2>
            </CardTitle>
            <CardDescription>{currentContent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  transform: reduceMotion ? "translateX(0)" : `translateX(${direction * 12}px)`,
                }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                exit={{
                  opacity: 0,
                  transform: reduceMotion ? "translateX(0)" : `translateX(${direction * -8}px)`,
                }}
                transition={{ duration: reduceMotion ? 0.12 : 0.16, ease: "easeOut" }}
              >
                {stepBody}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {showSidebar ? (
          <aside className="hidden lg:block" aria-label="Resumen de la reserva">
            <div className="sticky top-24">
              <ReservationSummary draft={draft} court={court} slot={selectedSlot} />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}

export { ReservationWizard }

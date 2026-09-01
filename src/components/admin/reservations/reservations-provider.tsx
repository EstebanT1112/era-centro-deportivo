"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import { recurringReservations as initialRecurring, reservations as initialReservations } from "@/mocks"
import { calculateDeposit } from "@/config/reservations"
import type { RecurringReservation, Reservation } from "@/types"

interface NewReservationInput {
  courtId: string
  customerName: string
  customerPhone: string
  date: string
  startTime: string
  endTime: string
  totalAmount: number
}

interface ReservationsContextValue {
  reservations: Reservation[]
  recurringReservations: RecurringReservation[]
  registerPayment: (id: string) => void
  completeReservation: (id: string) => void
  addReservation: (input: NewReservationInput) => Reservation
  addRecurringReservation: (input: Omit<RecurringReservation, "id" | "status">) => void
  toggleRecurringStatus: (id: string) => void
}

const ReservationsContext = createContext<ReservationsContextValue | null>(null)

function ReservationsProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState(() => initialReservations.map((item) => ({ ...item })))
  const [recurringReservations, setRecurringReservations] = useState(() => initialRecurring.map((item) => ({ ...item })))

  const value = useMemo<ReservationsContextValue>(() => ({
    reservations,
    recurringReservations,
    registerPayment(id) {
      setReservations((items) => items.map((item) => item.id === id ? {
        ...item,
        status: item.status === "pending_payment" ? "confirmed" : item.status,
        paymentStatus: "approved",
        paidBalance: item.totalAmount - item.depositAmount,
      } : item))
    },
    completeReservation(id) {
      setReservations((items) => items.map((item) => item.id === id ? { ...item, status: "completed" } : item))
    },
    addReservation(input) {
      const token = Math.random().toString(36).slice(2, 7).toUpperCase()
      const reservation: Reservation = {
        ...input,
        id: `reservation-session-${token.toLowerCase()}`,
        code: `RES-${token}`,
        status: "pending_payment",
        depositAmount: calculateDeposit(input.totalAmount),
        paidBalance: 0,
        paymentStatus: "pending",
      }
      setReservations((items) => [...items, reservation])
      return reservation
    },
    addRecurringReservation(input) {
      setRecurringReservations((items) => [...items, {
        ...input,
        id: `recurring-${Math.random().toString(36).slice(2, 9)}`,
        status: "active",
      }])
    },
    toggleRecurringStatus(id) {
      setRecurringReservations((items) => items.map((item) => item.id === id ? {
        ...item,
        status: item.status === "active" ? "inactive" : "active",
      } : item))
    },
  }), [recurringReservations, reservations])

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>
}

function useAdminReservations() {
  const context = useContext(ReservationsContext)
  if (!context) throw new Error("useAdminReservations debe usarse dentro de ReservationsProvider")
  return context
}

export { ReservationsProvider, useAdminReservations }
export type { NewReservationInput }

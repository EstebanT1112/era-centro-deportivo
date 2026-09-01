import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReservationDetail } from "@/components/admin/reservations/reservation-detail"
import { reservations } from "@/mocks";

export const metadata: Metadata = { title: "Detalle de reserva" }

export function generateStaticParams() {
  return reservations.map((reservation) => ({ id: reservation.id }));
}

export default async function AdminReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isSessionReservation = id.startsWith("reservation-session-")

  if (!isSessionReservation && !reservations.some((reservation) => reservation.id === id)) {
    notFound()
  }

  return <ReservationDetail reservationId={id} />
}

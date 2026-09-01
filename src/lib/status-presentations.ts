import type { CourtStatus, PaymentStatus, ReservationStatus } from "@/types"
import { COURT_STATUSES, PAYMENT_STATUSES, RESERVATION_STATUSES } from "@/constants/domain"
import type { StatusBadgeVariant } from "@/components/shared/status-badge"

const reservationVariants: Record<ReservationStatus, StatusBadgeVariant> = {
  pending_payment: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
  expired: "neutral",
}

const paymentVariants: Record<PaymentStatus, StatusBadgeVariant> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  refunded: "info",
}

const courtVariants: Record<CourtStatus, StatusBadgeVariant> = {
  active: "success",
  inactive: "neutral",
  maintenance: "warning",
}

function getLabel<T extends string>(items: ReadonlyArray<{ value: T; label: string }>, value: T) {
  return items.find((item) => item.value === value)?.label ?? value
}

export function getReservationStatusPresentation(status: ReservationStatus) {
  return { label: getLabel(RESERVATION_STATUSES, status), variant: reservationVariants[status] }
}

export function getPaymentStatusPresentation(status: PaymentStatus) {
  return { label: getLabel(PAYMENT_STATUSES, status), variant: paymentVariants[status] }
}

export function getCourtStatusPresentation(status: CourtStatus) {
  return { label: getLabel(COURT_STATUSES, status), variant: courtVariants[status] }
}

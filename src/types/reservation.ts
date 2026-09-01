import type { Court } from "./court";
import type { Weekday } from "./schedule";

export type ReservationStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "expired";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "refunded";

export interface Reservation {
  id: string;
  code: string;
  courtId: Court["id"];
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalAmount: number;
  depositAmount: number;
  paidBalance: number;
  paymentStatus: PaymentStatus;
}

export type RecurringReservationStatus = "active" | "inactive";

export interface RecurringReservation {
  id: string;
  customerName: string;
  customerPhone: string;
  courtId: Court["id"];
  weekday: Weekday;
  startTime: string;
  startDate: string;
  endDate: string;
  status: RecurringReservationStatus;
}

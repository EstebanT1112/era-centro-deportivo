export type FaqCategory =
  | "reservas"
  | "pagos"
  | "canchas"
  | "horarios"
  | "tienda"
  | "club";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

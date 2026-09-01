export type GalleryCategory =
  | "canchas"
  | "instalaciones"
  | "partidos"
  | "club"
  | "otros";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  title?: string;
  description?: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

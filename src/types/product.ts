export interface ProductVariant {
  label: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  isAvailable: boolean;
  isFeatured: boolean;
  isVisible: boolean;
}

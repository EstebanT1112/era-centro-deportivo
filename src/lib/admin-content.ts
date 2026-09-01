import { SITE_IMAGES } from "@/constants/assets";
import type { Post, PostContentBlock, Product } from "@/types";

export type PostDraft = Omit<Post, "id">;
export type ProductDraft = Omit<Product, "id">;

export const CONTENT_IMAGE_OPTIONS = [
  ...Object.values(SITE_IMAGES.home),
  ...Object.values(SITE_IMAGES.news),
  ...Object.values(SITE_IMAGES.products),
  ...Object.values(SITE_IMAGES.gallery),
];

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function clonePost(post: Post): Post {
  return { ...post, content: post.content.map((block) => ({ ...block })), secondaryImages: post.secondaryImages?.map((image) => ({ ...image })) };
}

export function cloneProduct(product: Product): Product {
  return { ...product, images: [...product.images], variants: product.variants.map((variant) => ({ ...variant })) };
}

export function createEmptyPost(): PostDraft {
  return { title: "", slug: "", excerpt: "", coverImage: "", category: "", status: "draft", isFeatured: false, content: [{ type: "paragraph", text: "" }] };
}

export function createEmptyProduct(): ProductDraft {
  return { name: "", slug: "", description: "", price: 0, category: "", images: [], variants: [], isAvailable: true, isFeatured: false, isVisible: true };
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePost(draft: PostDraft) {
  const errors: Record<string, string> = {};
  if (!draft.title.trim()) errors.title = "Ingresá el título.";
  if (!slugPattern.test(draft.slug)) errors.slug = "Usá minúsculas, números y guiones.";
  if (!draft.excerpt.trim()) errors.excerpt = "Ingresá el resumen.";
  if (!draft.category) errors.category = "Seleccioná una categoría.";
  if (!draft.coverImage) errors.coverImage = "Seleccioná una imagen de portada.";
  if (!draft.content.some((block) => block.type === "image" || block.text.trim())) errors.content = "Agregá contenido a la noticia.";
  if (draft.content.some((block) => block.type === "image" && (!block.src || !block.alt.trim()))) errors.content = "Las imágenes del contenido necesitan imagen y texto alternativo.";
  return errors;
}

export function validateProduct(draft: ProductDraft) {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = "Ingresá el nombre.";
  if (!slugPattern.test(draft.slug)) errors.slug = "Usá minúsculas, números y guiones.";
  if (!draft.description.trim()) errors.description = "Ingresá la descripción.";
  if (!(draft.price > 0)) errors.price = "El precio debe ser mayor que cero.";
  if (!draft.category) errors.category = "Seleccioná una categoría.";
  if (!draft.images.length) errors.images = "Agregá al menos una imagen.";
  if (draft.variants.some((variant) => !variant.label.trim())) errors.variants = "Todas las variantes necesitan un nombre.";
  return errors;
}

export function updateBlock(block: PostContentBlock, value: string): PostContentBlock {
  return block.type === "image" ? { ...block, alt: value } : { ...block, text: value };
}

import { courts, faqs, galleryItems, posts, products, reservations } from "@/mocks";

export function getCourtById(id: string) {
  return courts.find((court) => court.id === id);
}

export function getCourtBySlug(slug: string) {
  return courts.find((court) => court.slug === slug && court.status !== "inactive");
}

export function getPublicCourts() {
  return courts
    .filter((court) => court.status !== "inactive")
    .toSorted((a, b) => a.order - b.order)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug && product.isVisible);
}

export function getPostBySlug(slug: string) {
  return posts.find(
    (post) => post.slug === slug && post.status === "published",
  );
}

export function getReservationById(id: string) {
  return reservations.find((reservation) => reservation.id === id);
}

export function getReservationsByCourt(courtId: string) {
  return reservations.filter((reservation) => reservation.courtId === courtId);
}

export function getFeaturedCourts() {
  return getPublicCourts().filter((court) => court.isFeatured);
}

export function getFeaturedProducts() {
  return products.filter(
    (product) => product.isFeatured && product.isVisible && product.isAvailable,
  );
}

export function getPublishedPosts() {
  return posts
    .filter((post) => post.status === "published")
    .toSorted((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export function getVisibleProducts() {
  return products.filter((product) => product.isVisible);
}

export function getRelatedPosts(postId: string, category: string, limit = 3) {
  const published = getPublishedPosts().filter((post) => post.id !== postId)
  return [
    ...published.filter((post) => post.category === category),
    ...published.filter((post) => post.category !== category),
  ].slice(0, limit)
}

export function getFeaturedFaqs() {
  return faqs
    .filter((faq) => faq.isFeatured && faq.isVisible)
    .toSorted((a, b) => a.order - b.order);
}

export function getFeaturedGalleryItems() {
  return galleryItems
    .filter((item) => item.isFeatured && item.isVisible)
    .toSorted((a, b) => a.order - b.order);
}

export function getVisibleFaqs() {
  return faqs
    .filter((faq) => faq.isVisible)
    .toSorted((a, b) => a.order - b.order);
}

export function getVisibleGalleryItems() {
  return galleryItems
    .filter((item) => item.isVisible)
    .toSorted((a, b) => a.order - b.order);
}

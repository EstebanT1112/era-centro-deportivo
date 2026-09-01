import type { Faq, GalleryItem, SiteContent } from "@/types"

export function cloneGalleryItem(item: GalleryItem): GalleryItem {
  return { ...item }
}

export function cloneFaq(faq: Faq): Faq {
  return { ...faq }
}

export function cloneSiteContent(content: SiteContent): SiteContent {
  return {
    home: { ...content.home },
    club: { ...content.club, images: [...content.club.images], serviceIds: [...content.club.serviceIds] },
    services: content.services.map((service) => ({ ...service })),
  }
}

export function sortGalleryItems(items: GalleryItem[]) {
  return items.toSorted((a, b) => a.order - b.order)
}

export function sortFaqs(items: Faq[]) {
  return items.toSorted((a, b) => a.category.localeCompare(b.category) || a.order - b.order)
}

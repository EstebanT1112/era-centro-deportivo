"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import { cloneFaq, cloneGalleryItem, cloneSiteContent } from "@/lib/admin-site-content"
import { faqs as initialFaqs, galleryItems as initialGalleryItems, siteContent as initialSiteContent } from "@/mocks"
import type { Faq, GalleryItem, SiteContent } from "@/types"

interface SiteContentContextValue {
  galleryItems: GalleryItem[]
  faqs: Faq[]
  siteContent: SiteContent
  addGalleryItem: (item: Omit<GalleryItem, "id">) => GalleryItem
  updateGalleryItem: (id: string, item: Omit<GalleryItem, "id">) => void
  moveGalleryItem: (id: string, direction: -1 | 1) => void
  addFaq: (faq: Omit<Faq, "id">) => void
  updateFaq: (id: string, faq: Omit<Faq, "id">) => void
  updateSiteContent: (content: SiteContent) => void
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

function SiteContentProvider({ children }: { children: ReactNode }) {
  const [galleryItems, setGalleryItems] = useState(() => initialGalleryItems.map(cloneGalleryItem))
  const [faqs, setFaqs] = useState(() => initialFaqs.map(cloneFaq))
  const [siteContent, setSiteContent] = useState(() => cloneSiteContent(initialSiteContent))

  const value = useMemo<SiteContentContextValue>(() => ({
    galleryItems,
    faqs,
    siteContent,
    addGalleryItem(item) {
      const created = { ...item, id: `gallery-${Math.random().toString(36).slice(2, 9)}` }
      setGalleryItems((items) => [...items, created])
      return created
    },
    updateGalleryItem(id, item) {
      setGalleryItems((items) => items.map((current) => current.id === id ? { ...item, id } : current))
    },
    moveGalleryItem(id, direction) {
      setGalleryItems((items) => {
        const ordered = items.toSorted((a, b) => a.order - b.order)
        const index = ordered.findIndex((item) => item.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= ordered.length) return items
        ;[ordered[index], ordered[target]] = [ordered[target], ordered[index]]
        return ordered.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
      })
    },
    addFaq(faq) {
      setFaqs((items) => [...items, { ...faq, id: `faq-${Math.random().toString(36).slice(2, 9)}` }])
    },
    updateFaq(id, faq) {
      setFaqs((items) => items.map((current) => current.id === id ? { ...faq, id } : current))
    },
    updateSiteContent(content) {
      setSiteContent(cloneSiteContent(content))
    },
  }), [faqs, galleryItems, siteContent])

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

function useAdminSiteContent() {
  const context = useContext(SiteContentContext)
  if (!context) throw new Error("useAdminSiteContent debe usarse dentro de SiteContentProvider")
  return context
}

export { SiteContentProvider, useAdminSiteContent }

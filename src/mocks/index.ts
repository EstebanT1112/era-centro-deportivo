import { validateGlobalMockIntegrity } from "@/lib/mock-integrity"

import { adminUsers } from "./admin-users"
import { auditLog } from "./audit-log"
import { siteContent } from "./content"
import { courtBlocks } from "./court-blocks"
import { courts } from "./courts"
import { disciplineMockIntegrity, disciplines } from "./disciplines"
import { faqs } from "./faqs"
import { galleryItems } from "./gallery"
import { posts } from "./posts"
import { products } from "./products"
import { recurringReservations } from "./recurring-reservations"
import { reservations } from "./reservations"
import { teachers } from "./teachers"

export {
  adminUsers,
  auditLog,
  courtBlocks,
  courts,
  disciplineMockIntegrity,
  disciplines,
  faqs,
  galleryItems,
  posts,
  products,
  recurringReservations,
  reservations,
  siteContent,
  teachers,
}

export const globalMockIntegrity = validateGlobalMockIntegrity({
  adminUsers,
  auditLog,
  courtBlocks,
  courts,
  disciplineIssues: disciplineMockIntegrity.issues,
  disciplines,
  faqs,
  galleryItems,
  posts,
  products,
  recurringReservations,
  reservations,
  teachers,
})

if (!globalMockIntegrity.isValid) {
  throw new Error(`Los mocks globales no son válidos:\n${globalMockIntegrity.issues.join("\n")}`)
}

import { FAQ_CATEGORIES, GALLERY_CATEGORIES, POST_CATEGORIES, PRODUCT_CATEGORIES, WEEKDAYS } from "@/constants/domain"
import type {
  AdminUser,
  AuditLogEntry,
  Court,
  CourtBlock,
  Discipline,
  Faq,
  GalleryItem,
  Post,
  Product,
  RecurringReservation,
  Reservation,
  Teacher,
} from "@/types"

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/

interface MockCollections {
  courts: readonly Court[]
  courtBlocks: readonly CourtBlock[]
  reservations: readonly Reservation[]
  recurringReservations: readonly RecurringReservation[]
  posts: readonly Post[]
  products: readonly Product[]
  galleryItems: readonly GalleryItem[]
  faqs: readonly Faq[]
  adminUsers: readonly AdminUser[]
  auditLog: readonly AuditLogEntry[]
  disciplines: readonly Discipline[]
  teachers: readonly Teacher[]
  disciplineIssues?: readonly string[]
}

function findDuplicates(values: readonly string[]) {
  const seen = new Set<string>()
  return [...new Set(values.filter((value) => seen.size === seen.add(value).size))]
}

function hasSequentialOrders(values: readonly number[]) {
  return [...values].toSorted((a, b) => a - b).every((value, index) => value === index + 1)
}

function isValidTimeRange(startTime: string, endTime: string) {
  return timePattern.test(startTime) && timePattern.test(endTime) && startTime < endTime
}

function validateSlugs(label: string, slugs: readonly string[], issues: string[]) {
  for (const duplicate of findDuplicates(slugs)) issues.push(`Slug duplicado en ${label}: ${duplicate}.`)
  for (const slug of slugs.filter((value) => !slugPattern.test(value))) issues.push(`Slug inválido en ${label}: ${slug}.`)
}

export function validateGlobalMockIntegrity(data: MockCollections) {
  const issues = [...(data.disciplineIssues ?? [])]
  const courtIds = new Set(data.courts.map((court) => court.id))
  const userIds = new Set(data.adminUsers.map((user) => user.id))
  const weekdayValues = new Set(WEEKDAYS.map((day) => day.value))
  const entityIds = [
    ...data.courts.map((item) => item.id),
    ...data.courtBlocks.map((item) => item.id),
    ...data.reservations.map((item) => item.id),
    ...data.recurringReservations.map((item) => item.id),
    ...data.posts.map((item) => item.id),
    ...data.products.map((item) => item.id),
    ...data.galleryItems.map((item) => item.id),
    ...data.faqs.map((item) => item.id),
    ...data.adminUsers.map((item) => item.id),
    ...data.auditLog.map((item) => item.id),
    ...data.teachers.map((item) => item.id),
    ...data.disciplines.flatMap((discipline) => [
      discipline.id,
      ...discipline.categories.flatMap((category) => [
        category.id,
        ...category.schedules.map((schedule) => schedule.id),
      ]),
    ]),
  ]

  for (const duplicate of findDuplicates(entityIds)) issues.push(`ID global duplicado: ${duplicate}.`)

  validateSlugs("canchas", data.courts.map((item) => item.slug), issues)
  validateSlugs("noticias", data.posts.map((item) => item.slug), issues)
  validateSlugs("productos", data.products.map((item) => item.slug), issues)
  validateSlugs("disciplinas", data.disciplines.map((item) => item.slug), issues)

  if (!hasSequentialOrders(data.courts.map((item) => item.order))) issues.push("El orden de canchas no es secuencial.")
  if (!hasSequentialOrders(data.galleryItems.map((item) => item.order))) issues.push("El orden de galería no es secuencial.")

  for (const category of FAQ_CATEGORIES.map((item) => item.value)) {
    const orders = data.faqs.filter((faq) => faq.category === category).map((faq) => faq.order)
    if (orders.length && !hasSequentialOrders(orders)) issues.push(`El orden de FAQ no es secuencial en ${category}.`)
  }

  for (const reservation of data.reservations) {
    if (!courtIds.has(reservation.courtId)) issues.push(`Cancha inexistente ${reservation.courtId} en ${reservation.id}.`)
    if (!isValidTimeRange(reservation.startTime, reservation.endTime)) issues.push(`Horario inválido en ${reservation.id}.`)
    if (reservation.depositAmount > reservation.totalAmount || reservation.paidBalance > reservation.totalAmount) {
      issues.push(`Importes inválidos en ${reservation.id}.`)
    }
  }

  for (const recurring of data.recurringReservations) {
    if (!courtIds.has(recurring.courtId)) issues.push(`Cancha inexistente ${recurring.courtId} en ${recurring.id}.`)
    if (!weekdayValues.has(recurring.weekday) || !timePattern.test(recurring.startTime)) issues.push(`Horario inválido en ${recurring.id}.`)
  }

  for (const block of data.courtBlocks) {
    if (!courtIds.has(block.courtId)) issues.push(`Cancha inexistente ${block.courtId} en ${block.id}.`)
    if (!isValidTimeRange(block.startTime, block.endTime)) issues.push(`Horario inválido en ${block.id}.`)
  }

  for (const court of data.courts) {
    const weekdays = court.weeklySchedule.map((schedule) => String(schedule.weekday))
    if (findDuplicates(weekdays).length || weekdays.length !== WEEKDAYS.length) issues.push(`Días semanales inválidos en ${court.id}.`)
    for (const schedule of court.weeklySchedule) {
      if (!weekdayValues.has(schedule.weekday) || (schedule.enabled && !isValidTimeRange(schedule.startTime, schedule.endTime))) {
        issues.push(`Horario semanal inválido en ${court.id}.`)
      }
    }
  }

  for (const entry of data.auditLog) {
    if (!userIds.has(entry.userId)) issues.push(`Usuario inexistente ${entry.userId} en ${entry.id}.`)
  }

  const postCategories = new Set<string>(POST_CATEGORIES)
  const productCategories = new Set<string>(PRODUCT_CATEGORIES)
  const galleryCategories = new Set<string>(GALLERY_CATEGORIES.map((item) => item.value))
  const faqCategories = new Set<string>(FAQ_CATEGORIES.map((item) => item.value))

  for (const post of data.posts) if (!postCategories.has(post.category)) issues.push(`Categoría de noticia inválida en ${post.id}.`)
  for (const product of data.products) if (!productCategories.has(product.category)) issues.push(`Categoría de producto inválida en ${product.id}.`)
  for (const item of data.galleryItems) if (!galleryCategories.has(item.category)) issues.push(`Categoría de galería inválida en ${item.id}.`)
  for (const faq of data.faqs) if (!faqCategories.has(faq.category)) issues.push(`Categoría de FAQ inválida en ${faq.id}.`)

  return { isValid: issues.length === 0, issues }
}

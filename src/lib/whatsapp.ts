export function normalizeWhatsAppPhone(phone: string) {
  return phone.replace(/\D/g, "")
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = normalizeWhatsAppPhone(phone)
  const recipient = digits ? `/${digits}` : "/"

  return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`
}

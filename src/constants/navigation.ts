import type { NavigationItem } from "@/types";

export const publicNavigation: ReadonlyArray<NavigationItem> = [
  { label: "Inicio", href: "/" },
  { label: "Centro", href: "/club" },
  { label: "Canchas", href: "/canchas" },
  { label: "Disciplinas", href: "/disciplinas" },
  { label: "Reservar cancha", href: "/reservas", isPrimary: true },
  { label: "Noticias", href: "/noticias" },
  { label: "Tienda", href: "/tienda" },
  { label: "Galería", href: "/galeria" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const publicFooterNavigation = [
  { title: "Centro deportivo", hrefs: ["/", "/club", "/disciplinas", "/canchas", "/galeria"] },
  {
    title: "Información",
    hrefs: ["/noticias", "/preguntas-frecuentes", "/contacto"],
  },
  { title: "Reservas", hrefs: ["/reservas", "/canchas"] },
] as const;

export { adminNavigation } from "@/config/admin-navigation"

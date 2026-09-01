import { SITE_IMAGES } from "@/constants/assets";
import type { Post } from "@/types";

export const posts: Post[] = [
  {
    id: "post-horario-verano", title: "Nuevo horario de verano", slug: "nuevo-horario-de-verano",
    excerpt: "Desde diciembre Espacio ERA amplía sus horarios para aprovechar las tardes de verano.",
    coverImage: SITE_IMAGES.news.summerHours, category: "Institucional", status: "published", isFeatured: true, publishedAt: "2026-08-12",
    content: [
      { type: "paragraph", text: "Con la llegada de los días más largos, el centro deportivo amplía su atención para que más equipos puedan aprovechar las canchas durante la tarde y la noche." },
      { type: "paragraph", text: "El nuevo esquema comienza en diciembre y mantiene turnos todos los días, con iluminación disponible en las canchas habilitadas para juego nocturno." },
      { type: "heading", text: "Qué cambia para las reservas" },
      { type: "paragraph", text: "Los primeros turnos estarán disponibles desde las 8:00 y el último ingreso será a las 23:00. La disponibilidad concreta seguirá indicada en el selector de cada cancha." },
      { type: "image", src: SITE_IMAGES.gallery.eveningTraining, alt: "Entrenamiento al atardecer con la iluminación de Espacio ERA encendida", caption: "Las instalaciones acompañan el horario extendido durante la temporada de verano." },
    ],
  },
  {
    id: "post-torneo-aniversario", title: "Torneo aniversario de ERA", slug: "torneo-aniversario-del-club",
    excerpt: "Abrimos la inscripción para el torneo recreativo por un nuevo aniversario de ERA.",
    coverImage: SITE_IMAGES.news.anniversaryTournament, category: "Torneos", status: "published", isFeatured: true, publishedAt: "2026-08-08",
    content: [
      { type: "paragraph", text: "ERA celebra un nuevo aniversario con un torneo recreativo abierto a equipos del barrio, socios y grupos que reservan habitualmente nuestras canchas." },
      { type: "heading", text: "Formato e inscripción" },
      { type: "paragraph", text: "Los equipos jugarán una fase inicial por zonas y luego cruces de definición. Cada plantel podrá presentar hasta diez jugadores." },
    ],
  },
  {
    id: "post-mejoras-instalaciones", title: "Mejoras en las instalaciones", slug: "mejoras-en-las-instalaciones",
    excerpt: "Finalizaron los trabajos de renovación en vestuarios y zonas comunes.",
    coverImage: SITE_IMAGES.news.facilityImprovements, category: "Centro", status: "published", isFeatured: false, publishedAt: "2026-08-02",
    content: [
      { type: "paragraph", text: "Terminamos una nueva etapa de renovación enfocada en vestuarios, duchas y espacios comunes para mejorar la experiencia antes y después de cada turno." },
      { type: "heading", text: "Más comodidad para equipos y familias" },
      { type: "paragraph", text: "La intervención incorporó mejor iluminación, bancos renovados y señalización más clara en los recorridos principales." },
      { type: "image", src: SITE_IMAGES.gallery.lockerRooms, alt: "Interior de los vestuarios renovados de Espacio ERA" },
    ],
  },
  {
    id: "post-escuela-infantil", title: "Nueva temporada de la escuela infantil", slug: "nueva-temporada-escuela-infantil",
    excerpt: "Estamos preparando las inscripciones para la próxima temporada formativa.",
    coverImage: SITE_IMAGES.news.youthSchool, category: "Escuela", status: "draft", isFeatured: false,
    content: [{ type: "paragraph", text: "La escuela infantil prepara una nueva temporada de entrenamientos y encuentros formativos." }],
  },
];

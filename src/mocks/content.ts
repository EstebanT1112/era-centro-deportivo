import { HOME_IMAGES, SITE_IMAGES } from "@/constants/assets";
import type { SiteContent } from "@/types";

export const siteContent: SiteContent = {
  home: {
    heroTitle: "La cancha está lista. Tu equipo también.",
    heroDescription: "Canchas cuidadas, turnos simples y un centro deportivo abierto todos los días para jugar, entrenar y compartir.",
    heroImage: HOME_IMAGES.hero,
  },
  club: {
    introTitle: "Un centro deportivo hecho para jugar y encontrarse",
    introText: "Somos un centro deportivo de Villa Elisa con espíritu de barrio, instalaciones cuidadas y una comunidad que crece alrededor del deporte.",
    history: "ERA nació por iniciativa de familias y deportistas de Villa Elisa que buscaban un espacio cercano para jugar, entrenar y compartir.\n\nCon los años, la ampliación del predio permitió sumar nuevos formatos de cancha y actividades para distintas edades.\n\nHoy seguimos mejorando instalaciones y servicios sin perder la cercanía que define la experiencia del centro deportivo.",
    images: [
      SITE_IMAGES.home.community,
      SITE_IMAGES.courts.norte,
      SITE_IMAGES.gallery.sharedSpaces,
      SITE_IMAGES.home.hero,
    ],
    serviceIds: ["vestuarios", "duchas", "iluminacion", "estacionamiento", "buffet", "espacios-comunes"],
  },
  services: [
    { id: "vestuarios", title: "Vestuarios", description: "Espacios cómodos para llegar, cambiarse y preparar el partido." },
    { id: "duchas", title: "Duchas", description: "Instalaciones renovadas disponibles después de cada turno." },
    { id: "iluminacion", title: "Iluminación", description: "Canchas preparadas para jugar con buena visibilidad de noche." },
    { id: "estacionamiento", title: "Estacionamiento", description: "Acceso dentro del predio, sujeto a disponibilidad." },
    { id: "buffet", title: "Buffet", description: "Un punto de encuentro para el antes y el después del partido." },
    { id: "espacios-comunes", title: "Espacios comunes", description: "Sectores pensados para equipos, familias y comunidad." },
  ],
};

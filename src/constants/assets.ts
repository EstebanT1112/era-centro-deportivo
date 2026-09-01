export const MOCK_IMAGE_PATH = "/images/placeholder.svg";

export const SITE_IMAGES = {
  brand: {
    logo: "/images/brand/logo-principal-circulo-blanco.png",
  },
  home: {
    hero: "/images/home/hero-club-era.jpg",
    community: "/images/home/comunidad-era.jpg",
  },
  courts: {
    norte: "/images/courts/cancha-norte.jpg",
    sur: "/images/courts/cancha-sur.jpg",
    central: "/images/courts/cancha-central.jpg",
    techada: "/images/courts/cancha-techada.jpg",
  },
  disciplines: {
    futbol: "/images/disciplines/futbol.jpg",
    hockey: "/images/disciplines/hockey.jpg",
    voley: "/images/disciplines/voley.jpg",
  },
  news: {
    summerHours: "/images/news/horario-verano.jpg",
    anniversaryTournament: "/images/news/torneo-aniversario.jpg",
    facilityImprovements: "/images/news/mejoras-instalaciones.jpg",
    youthSchool: "/images/news/escuela-infantil.jpg",
  },
  products: {
    jersey: "/images/products/camiseta-oficial-2026.jpg",
    trainingShorts: "/images/products/short-entrenamiento.jpg",
    sweatshirt: "/images/products/buzo-oficial.jpg",
    trainingBall: "/images/products/pelota-entrenamiento.jpg",
  },
  gallery: {
    northCourt: "/images/gallery/cancha-norte-general.jpg",
    lockerRooms: "/images/gallery/vestuarios-renovados.jpg",
    anniversaryMatch: "/images/gallery/partido-aniversario.jpg",
    clubhouse: "/images/gallery/sede-social.jpg",
    communityDay: "/images/gallery/jornada-comunidad.jpg",
    eveningTraining: "/images/gallery/entrenamiento-atardecer.jpg",
    sharedSpaces: "/images/gallery/espacios-compartir.jpg",
  },
  teachers: {
    juanPerez: "/images/teachers/juan-perez.jpg",
    mariaLopez: "/images/teachers/maria-lopez.jpg",
    sofiaFernandez: "/images/teachers/sofia-fernandez.jpg",
    martinGonzalez: "/images/teachers/martin-gonzalez.jpg",
    diegoSosa: "/images/teachers/diego-sosa.jpg",
  },
} as const;

export const HOME_IMAGES = {
  hero: SITE_IMAGES.home.hero,
  court: SITE_IMAGES.courts.norte,
  community: SITE_IMAGES.home.community,
  facilities: SITE_IMAGES.gallery.lockerRooms,
  product: SITE_IMAGES.products.jersey,
  map: "/images/map-placeholder.svg",
} as const;

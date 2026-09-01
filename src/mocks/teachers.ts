import { SITE_IMAGES } from "@/constants/assets"
import type { Teacher } from "@/types"

export const teachers: Teacher[] = [
  {
    id: "teacher-juan-perez",
    name: "Juan Pérez",
    phone: "5492215550101",
    email: "juan.perez@eraclub.com.ar",
    image: SITE_IMAGES.teachers.juanPerez,
    bio: "Profesor de educación física y entrenador de fútbol formativo.",
    isActive: true,
  },
  {
    id: "teacher-maria-lopez",
    name: "María López",
    phone: "5492215550102",
    email: "maria.lopez@eraclub.com.ar",
    image: SITE_IMAGES.teachers.mariaLopez,
    bio: "Coordinadora de hockey con experiencia en divisiones juveniles y Primera.",
    isActive: true,
  },
  {
    id: "teacher-sofia-fernandez",
    name: "Sofía Fernández",
    phone: "5492215550103",
    image: SITE_IMAGES.teachers.sofiaFernandez,
    bio: "Entrenadora de deportes de equipo y preparación física juvenil.",
    isActive: true,
  },
  {
    id: "teacher-martin-gonzalez",
    name: "Martín González",
    phone: "5492215550104",
    email: "martin.gonzalez@eraclub.com.ar",
    image: SITE_IMAGES.teachers.martinGonzalez,
    bio: "Entrenador de fútbol con orientación en competencia federada.",
    isActive: true,
  },
  {
    id: "teacher-diego-sosa",
    name: "Diego Sosa",
    phone: "5492215550106",
    image: SITE_IMAGES.teachers.diegoSosa,
    isActive: true,
  },
]

import { SITE_IMAGES } from "@/constants/assets"
import { validateDisciplineMockIntegrity } from "@/lib/discipline-integrity"
import type { Discipline, DisciplineSchedule, Weekday } from "@/types"

import { teachers } from "./teachers"

function schedule(id: string, weekday: Weekday, startTime: string, endTime: string): DisciplineSchedule {
  return { id, weekday, startTime, endTime }
}

export const disciplines: Discipline[] = [
  {
    id: "discipline-futbol",
    name: "Fútbol",
    slug: "futbol",
    shortDescription: "Formación y competencia para categorías infantiles, juveniles y Primera.",
    description: "Una propuesta integral para aprender, entrenar y competir representando a Espacio ERA en cada etapa deportiva.",
    coverImage: SITE_IMAGES.disciplines.futbol,
    images: [SITE_IMAGES.disciplines.futbol],
    location: "Cancha principal",
    requirements: "Apto físico vigente, DNI y ropa deportiva.",
    responsibleTeacherIds: ["teacher-juan-perez"],
    isVisible: true,
    isFeatured: true,
    order: 1,
    categories: [
      {
        id: "football-u11",
        name: "Sub-11",
        ageRange: "9 a 11 años",
        schedules: [schedule("football-u11-tue", 2, "17:00", "18:30"), schedule("football-u11-thu", 4, "17:00", "18:30")],
        teacherIds: ["teacher-diego-sosa"],
        isActive: true,
        order: 1,
      },
      {
        id: "football-u15",
        name: "Sub-15",
        ageRange: "13 a 15 años",
        location: "Cancha auxiliar",
        schedules: [schedule("football-u15-tue", 2, "18:00", "19:30"), schedule("football-u15-thu", 4, "18:00", "19:30")],
        teacherIds: ["teacher-juan-perez", "teacher-martin-gonzalez"],
        isActive: true,
        order: 2,
      },
      {
        id: "football-u17",
        name: "Sub-17",
        ageRange: "16 a 17 años",
        schedules: [schedule("football-u17-tue", 2, "19:30", "21:00"), schedule("football-u17-thu", 4, "19:30", "21:00")],
        teacherIds: ["teacher-juan-perez"],
        isActive: true,
        order: 3,
      },
      {
        id: "football-first",
        name: "Primera",
        ageRange: "Desde 18 años",
        schedules: [schedule("football-first-mon", 1, "20:00", "21:30"), schedule("football-first-wed", 3, "20:00", "21:30"), schedule("football-first-fri", 5, "20:00", "21:30")],
        teacherIds: ["teacher-martin-gonzalez"],
        isActive: true,
        order: 4,
      },
    ],
  },
  {
    id: "discipline-hockey",
    name: "Hockey",
    slug: "hockey",
    shortDescription: "Escuela, juveniles y Primera con entrenamiento técnico y juego en equipo.",
    description: "Hockey femenino para distintas edades, con una propuesta progresiva que combina fundamentos, preparación física y competencia.",
    coverImage: SITE_IMAGES.disciplines.hockey,
    images: [SITE_IMAGES.disciplines.hockey],
    location: "Cancha auxiliar",
    requirements: "Apto físico y protector bucal. Consultar disponibilidad de palos para iniciación.",
    responsibleTeacherIds: ["teacher-maria-lopez"],
    isVisible: true,
    isFeatured: true,
    order: 2,
    categories: [
      {
        id: "hockey-u12",
        name: "Sub-12",
        ageRange: "8 a 12 años",
        schedules: [schedule("hockey-u12-mon", 1, "17:30", "19:00"), schedule("hockey-u12-wed", 3, "17:30", "19:00")],
        teacherIds: ["teacher-maria-lopez", "teacher-sofia-fernandez"],
        isActive: true,
        order: 1,
      },
      {
        id: "hockey-u16",
        name: "Sub-16",
        ageRange: "13 a 16 años",
        schedules: [schedule("hockey-u16-mon", 1, "19:00", "20:30"), schedule("hockey-u16-wed", 3, "19:00", "20:30")],
        teacherIds: ["teacher-maria-lopez"],
        isActive: true,
        order: 2,
      },
      {
        id: "hockey-first",
        name: "Primera",
        ageRange: "Desde 17 años",
        schedules: [schedule("hockey-first-tue", 2, "20:00", "21:30"), schedule("hockey-first-thu", 4, "20:00", "21:30")],
        teacherIds: ["teacher-sofia-fernandez"],
        isActive: true,
        order: 3,
      },
    ],
  },
  {
    id: "discipline-voley",
    name: "Vóley",
    slug: "voley",
    shortDescription: "Iniciación y equipos juveniles y mayores en el gimnasio cubierto.",
    description: "Clases y entrenamientos de vóley orientados al aprendizaje técnico, la convivencia y la participación competitiva.",
    coverImage: SITE_IMAGES.disciplines.voley,
    images: [SITE_IMAGES.disciplines.voley],
    location: "Gimnasio cubierto",
    responsibleTeacherIds: ["teacher-sofia-fernandez"],
    isVisible: true,
    isFeatured: true,
    order: 3,
    categories: [
      {
        id: "volleyball-beginners",
        name: "Iniciación",
        ageRange: "8 a 12 años",
        schedules: [schedule("volleyball-beginners-tue", 2, "17:00", "18:15"), schedule("volleyball-beginners-fri", 5, "17:00", "18:15")],
        teacherIds: ["teacher-sofia-fernandez"],
        isActive: true,
        order: 1,
      },
      {
        id: "volleyball-youth",
        name: "Juveniles",
        ageRange: "13 a 17 años",
        schedules: [schedule("volleyball-youth-tue", 2, "18:30", "20:00"), schedule("volleyball-youth-fri", 5, "18:30", "20:00")],
        teacherIds: ["teacher-diego-sosa"],
        isActive: true,
        order: 2,
      },
      {
        id: "volleyball-adults",
        name: "Mayores",
        ageRange: "Adultos",
        schedules: [schedule("volleyball-adults-wed", 3, "20:00", "21:30"), schedule("volleyball-adults-fri", 5, "20:00", "21:30")],
        teacherIds: ["teacher-sofia-fernandez", "teacher-diego-sosa"],
        isActive: true,
        order: 3,
      },
    ],
  },
]

export const disciplineMockIntegrity = validateDisciplineMockIntegrity(disciplines, teachers)

if (!disciplineMockIntegrity.isValid) {
  throw new Error(`Los mocks de disciplinas no son válidos:\n${disciplineMockIntegrity.issues.join("\n")}`)
}

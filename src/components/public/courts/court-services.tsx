import {
  CarFrontIcon,
  CoffeeIcon,
  DropletsIcon,
  LightbulbIcon,
  PanelsTopLeftIcon,
  ShowerHeadIcon,
  UsersRoundIcon,
} from "lucide-react"

import { ServiceItem } from "@/components/public/service-item"

const servicePresentation = {
  Vestuarios: {
    icon: UsersRoundIcon,
    description: "Espacio cómodo para preparar al equipo antes y después del partido.",
  },
  Duchas: {
    icon: ShowerHeadIcon,
    description: "Duchas disponibles junto a los vestuarios del centro deportivo.",
  },
  Iluminación: {
    icon: LightbulbIcon,
    description: "Iluminación deportiva para jugar con buena visibilidad de noche.",
  },
  Estacionamiento: {
    icon: CarFrontIcon,
    description: "Sector de estacionamiento dentro de las instalaciones.",
  },
  Tribuna: {
    icon: UsersRoundIcon,
    description: "Sector preparado para acompañantes y espectadores.",
  },
  Techada: {
    icon: PanelsTopLeftIcon,
    description: "Cancha protegida para sostener el juego ante cambios de clima.",
  },
  Buffet: {
    icon: CoffeeIcon,
    description: "Buffet del centro deportivo disponible para jugadores y acompañantes.",
  },
} as const

interface CourtServicesProps {
  services: string[]
}

function CourtServices({ services }: CourtServicesProps) {
  return (
    <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const presentation = servicePresentation[service as keyof typeof servicePresentation] ?? {
          icon: DropletsIcon,
          description: "Servicio disponible para quienes reservan esta cancha.",
        }

        return (
          <ServiceItem
            key={service}
            title={service}
            description={presentation.description}
            icon={presentation.icon}
            variant="surface"
          />
        )
      })}
    </div>
  )
}

export { CourtServices }

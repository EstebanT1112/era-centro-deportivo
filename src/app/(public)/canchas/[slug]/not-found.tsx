import Link from "next/link"
import { MapPinOffIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { buttonVariants } from "@/components/ui/button"

export default function CourtNotFound() {
  return (
    <PageContainer className="py-20 md:py-28">
      <EmptyState
        icon={MapPinOffIcon}
        titleAs="h1"
        title="No encontramos esa cancha"
        description="La dirección puede ser incorrecta o la cancha ya no está disponible en el catálogo."
        action={
          <Link href="/canchas" className={buttonVariants({ variant: "primary" })}>
            Volver a canchas
          </Link>
        }
      />
    </PageContainer>
  )
}

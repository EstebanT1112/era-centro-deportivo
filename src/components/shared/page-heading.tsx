import { PageHeader } from "@/components/shared/page-header"

interface PageHeadingProps {
  title: string
}

export function PageHeading({ title }: PageHeadingProps) {
  return <PageHeader title={title} />
}

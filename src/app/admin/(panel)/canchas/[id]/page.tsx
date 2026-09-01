import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourtForm } from "@/components/admin/courts/court-form";
import { getCourtById } from "@/lib/mock-selectors";
import { courts } from "@/mocks";

export function generateStaticParams() {
  return [...courts.map((court) => ({ id: court.id })), { id: "nueva" }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (id === "nueva") return { title: "Nueva cancha" };
  const court = getCourtById(id)
  return { title: court ? `Editar ${court.name}` : id.startsWith("court-session-") ? "Editar cancha" : "Cancha no encontrada" };
}

export default async function AdminCourtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isSessionCourt = id.startsWith("court-session-")

  if (id !== "nueva" && !isSessionCourt && !getCourtById(id)) {
    notFound()
  }

  return <CourtForm key={id} courtId={id} />;
}

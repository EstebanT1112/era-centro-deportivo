import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourtsList } from "@/components/admin/courts/courts-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Canchas" };

export default function AdminCourtsPage() {
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Canchas"
        description="Gestioná información, turnos, horarios, estado y bloqueos de cada espacio deportivo."
        actions={<Button render={<Link href="/admin/canchas/nueva" />} nativeButton={false}><PlusIcon data-icon="inline-start" aria-hidden="true" />Nueva cancha</Button>}
      />
      <CourtsList />
    </div>
  );
}

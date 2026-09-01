import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { ReservationsProvider } from "@/components/admin/reservations/reservations-provider";
import { CourtsProvider } from "@/components/admin/courts/courts-provider";
import { AdminContentProvider } from "@/components/admin/content/content-provider";
import { SiteContentProvider } from "@/components/admin/site-content/site-content-provider";
import { DisciplinesProvider } from "@/components/admin/disciplines/disciplines-provider";
import { TeachersProvider } from "@/components/admin/teachers/teachers-provider";

export const metadata: Metadata = {
  title: { default: "Administración", template: "%s | Administración" },
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ReservationsProvider>
      <CourtsProvider>
        <AdminContentProvider>
          <SiteContentProvider>
            <TeachersProvider>
              <DisciplinesProvider>
                <AdminShell>{children}</AdminShell>
              </DisciplinesProvider>
            </TeachersProvider>
          </SiteContentProvider>
        </AdminContentProvider>
      </CourtsProvider>
    </ReservationsProvider>
  );
}

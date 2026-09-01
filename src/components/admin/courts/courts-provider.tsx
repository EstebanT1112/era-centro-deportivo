"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { cloneCourt, slugifyCourtName, type CourtDraft } from "@/lib/admin-courts";
import { courtBlocks as initialBlocks, courts as initialCourts } from "@/mocks";
import type { Court, CourtBlock } from "@/types";

interface CourtsContextValue {
  courts: Court[];
  blocks: CourtBlock[];
  addCourt: (draft: CourtDraft) => Court;
  updateCourt: (id: string, draft: CourtDraft) => Court | undefined;
  setFeaturedCourts: (ids: string[]) => void;
  addBlock: (courtId: string, input: Omit<CourtBlock, "id" | "courtId">) => void;
  removeBlock: (id: string) => void;
}

const CourtsContext = createContext<CourtsContextValue | null>(null);

function CourtsProvider({ children }: { children: ReactNode }) {
  const [courts, setCourts] = useState(() => initialCourts.map(cloneCourt));
  const [blocks, setBlocks] = useState(() => initialBlocks.map((block) => ({ ...block })));

  const value = useMemo<CourtsContextValue>(() => ({
    courts,
    blocks,
    addCourt(draft) {
      const token = Math.random().toString(36).slice(2, 8);
      const baseSlug = slugifyCourtName(draft.name) || `cancha-${token}`;
      const slug = courts.some((court) => court.slug === baseSlug) ? `${baseSlug}-${token}` : baseSlug;
      const court: Court = cloneCourt({ ...draft, id: `court-session-${token}`, slug });
      setCourts((items) => [...items, court]);
      return court;
    },
    updateCourt(id, draft) {
      const current = courts.find((court) => court.id === id);
      if (!current) return undefined;
      const updated = cloneCourt({
        ...draft,
        id,
        slug: slugifyCourtName(draft.name) || current.slug,
      });
      setCourts((items) => items.map((court) => court.id === id ? updated : court));
      return updated;
    },
    setFeaturedCourts(ids) {
      const featuredIds = new Set(ids);
      setCourts((items) => items.map((court) => ({ ...court, isFeatured: featuredIds.has(court.id) })));
    },
    addBlock(courtId, input) {
      setBlocks((items) => [...items, {
        ...input,
        courtId,
        id: `block-${Math.random().toString(36).slice(2, 9)}`,
      }]);
    },
    removeBlock(id) {
      setBlocks((items) => items.filter((block) => block.id !== id));
    },
  }), [blocks, courts]);

  return <CourtsContext.Provider value={value}>{children}</CourtsContext.Provider>;
}

function useAdminCourts() {
  const context = useContext(CourtsContext);
  if (!context) throw new Error("useAdminCourts debe usarse dentro de CourtsProvider");
  return context;
}

export { CourtsProvider, useAdminCourts };

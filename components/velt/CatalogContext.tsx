"use client";

// [Velt] Active-catalog context (Access Context authoring).
//
// The customer tags every new comment with `context.access.catalogId`. In this
// demo the user chooses WHICH catalog new comments are tagged with via a selector
// in the header. We hold that choice in React context so both the header selector
// and the comment tagger (components/velt/CommentContextTagger.tsx) share it.
//
// This only controls the catalog NEW comments are authored under. Which comments
// a user can READ is controlled separately by their catalogAccess in the access
// model + the Permission Provider's `type: "context"` checks.

import { createContext, useContext, useMemo, useState } from "react";
import { CATALOGS, DEFAULT_CATALOG_ID } from "./accessModel";

interface CatalogContextValue {
  activeCatalogId: string;
  setActiveCatalogId: (catalogId: string) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [activeCatalogId, setActiveCatalogId] = useState(DEFAULT_CATALOG_ID);
  const value = useMemo(
    () => ({ activeCatalogId, setActiveCatalogId }),
    [activeCatalogId],
  );
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useActiveCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    // Safe fallback so components can render outside the provider in isolation.
    return { activeCatalogId: DEFAULT_CATALOG_ID, setActiveCatalogId: () => {} };
  }
  return ctx;
}

export { CATALOGS };

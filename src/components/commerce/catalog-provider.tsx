"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLiveCatalogState, type StudioCatalogState } from "@/lib/studio/catalog-storage";

interface CatalogContextValue { state: StudioCatalogState; hydrated: boolean; }
const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({children}:{children:ReactNode}){
  const {state,hydrated}=useLiveCatalogState();
  return <CatalogContext.Provider value={{state,hydrated}}>{children}</CatalogContext.Provider>;
}

export function useCatalog(){
  const context=useContext(CatalogContext);
  if(!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}

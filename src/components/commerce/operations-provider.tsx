"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_OPERATIONS_STATE, OPERATIONS_EVENT, OPERATIONS_STORAGE_KEY, readOperationsState, writeOperationsState, type StudioOperationsState } from "@/lib/studio/operations-storage";

interface OperationsContextValue {
  hydrated: boolean;
  state: StudioOperationsState;
  update: (updater: (current: StudioOperationsState) => StudioOperationsState) => void;
  replace: (state: StudioOperationsState) => void;
  reset: () => void;
}
const Context = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [hydrated,setHydrated] = useState(false);
  const [state,setState] = useState<StudioOperationsState>(DEFAULT_OPERATIONS_STATE);
  useEffect(()=>{
    setState(readOperationsState()); setHydrated(true);
    const sync=()=>setState(readOperationsState());
    const storage=(event:StorageEvent)=>{ if(event.key===OPERATIONS_STORAGE_KEY) sync(); };
    window.addEventListener("storage",storage); window.addEventListener(OPERATIONS_EVENT,sync as EventListener);
    return()=>{window.removeEventListener("storage",storage);window.removeEventListener(OPERATIONS_EVENT,sync as EventListener);};
  },[]);
  const replace=useCallback((next:StudioOperationsState)=>{setState(next);writeOperationsState(next);},[]);
  const update=useCallback((updater:(current:StudioOperationsState)=>StudioOperationsState)=>{setState((current)=>{const next=updater(current);writeOperationsState(next);return next;});},[]);
  const reset=useCallback(()=>replace(structuredClone(DEFAULT_OPERATIONS_STATE)),[replace]);
  const value=useMemo(()=>({hydrated,state,update,replace,reset}),[hydrated,state,update,replace,reset]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useOperations(){const value=useContext(Context);if(!value)throw new Error("useOperations must be inside OperationsProvider");return value;}

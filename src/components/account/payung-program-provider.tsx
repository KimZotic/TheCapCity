"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_PAYUNG_STATE,
  PAYUNG_PROGRAM_EVENT,
  readPayungProgramState,
  writePayungProgramState,
  type PayungProgramState,
} from "@/lib/account/payung-storage";

interface PayungProgramContextValue {
  state: PayungProgramState;
  hydrated: boolean;
  replaceState: (next: PayungProgramState) => void;
  refresh: () => void;
}

const PayungProgramContext = createContext<PayungProgramContextValue | null>(null);

export function PayungProgramProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PayungProgramState>(DEFAULT_PAYUNG_STATE);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setState(readPayungProgramState()), []);
  useEffect(() => { refresh(); setHydrated(true); }, [refresh]);
  useEffect(() => {
    function onState(event: Event) {
      const detail = (event as CustomEvent<PayungProgramState>).detail;
      setState(detail ?? readPayungProgramState());
    }
    window.addEventListener(PAYUNG_PROGRAM_EVENT, onState);
    return () => window.removeEventListener(PAYUNG_PROGRAM_EVENT, onState);
  }, []);

  const replaceState = useCallback((next: PayungProgramState) => {
    writePayungProgramState(next);
    setState(next);
  }, []);

  const value = useMemo(() => ({ state, hydrated, replaceState, refresh }), [state, hydrated, replaceState, refresh]);
  return <PayungProgramContext.Provider value={value}>{children}</PayungProgramContext.Provider>;
}

export function usePayungProgram() {
  const context = useContext(PayungProgramContext);
  if (!context) throw new Error("usePayungProgram must be used inside PayungProgramProvider");
  return context;
}

"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="grid min-h-screen place-items-center bg-[#09090a] px-4 text-white">
      <div className="w-full max-w-[560px] rounded-[24px_24px_8px_24px] border border-white/10 bg-[#15161a] p-6 sm:p-8">
        <p className="text-[9px] font-bold uppercase tracking-[.12em] text-white/36">Storefront recovery</p>
        <h1 className="font-display mt-3 text-[clamp(1.8rem,7vw,3rem)] leading-none tracking-[-.045em]">Something didn’t load cleanly.</h1>
        <p className="mt-3 text-[10px] leading-5 text-white/44">Your cart and demo state are kept in this browser. Retry the surface without starting over.</p>
        <button type="button" onClick={reset} className="tcc-button tcc-button-inverse mt-5">Try again ↗</button>
      </div>
    </main>
  );
}

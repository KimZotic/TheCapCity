"use client";

import Link from "next/link";
import { useOperations } from "@/components/commerce/operations-provider";
import { DropCard } from "@/components/storefront/drop-card";

export function LiveDropsPage(){
  const {state}=useOperations();
  const drops=state.drops.filter((drop)=>drop.published&&!drop.archived);
  const upcoming=drops.find((drop)=>drop.status==="upcoming");
  const current=drops.filter((drop)=>drop.id!==upcoming?.id);
  return <section className="px-3 py-6 min-[390px]:px-4 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto max-w-[1280px]"><header className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><h1 className="font-display text-[clamp(1.8rem,5vw,2.7rem)] leading-none">Drops & events.</h1><Link href="/shop" className="text-[9px] font-semibold text-white/42 hover:text-white">Shop all ↗</Link></header>{upcoming&&<div className="mt-4"><DropCard drop={upcoming}/></div>}{current.length>0&&<div className="mt-3 grid gap-3 sm:grid-cols-2">{current.map((drop)=><DropCard key={drop.id} drop={drop}/>)}</div>}{!drops.length&&<div className="grid min-h-[380px] place-items-center text-[10px] text-white/35">No published drops right now.</div>}</div></section>;
}

"use client";

import { PointerEvent, useState } from "react";

export function SpatialProductCard({ image, label = "KL Legacy detail" }: { image: string; label?: string }) {
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) translateZ(0)");
  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    setTransform(`rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(8px)`);
  }
  return <div className="tcc-float absolute right-3 top-[76px] hidden w-[210px] [perspective:900px] min-[520px]:block sm:right-6 sm:w-[235px] lg:right-9 lg:top-[82px] lg:w-[274px]" onPointerMove={move} onPointerLeave={() => setTransform("rotateX(0deg) rotateY(0deg) translateZ(0)")}>
    <div style={{ transform }} className="overflow-hidden rounded-[24px_8px_24px_8px] border border-white/16 bg-white/[.08] p-2 shadow-[0_28px_70px_rgba(0,0,0,.34)] backdrop-blur-md transition-transform duration-200 [transform-style:preserve-3d]">
      <div className="relative aspect-square overflow-hidden rounded-[18px_6px_18px_6px] bg-[#ecebe6]"><img src={image} alt={label} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-tr from-black/12 via-transparent to-white/12"/></div>
      <div className="flex items-center justify-between px-2 pb-1 pt-2.5"><div><p className="text-[7px] font-bold uppercase tracking-[.1em] text-white/35">SPATIAL / 01</p><p className="mt-1 text-[10px] font-semibold text-white/78">{label}</p></div><span className="grid h-7 w-7 place-items-center rounded-[9px_3px_9px_3px] bg-[#d7ff57] text-[10px] font-bold text-black">↗</span></div>
    </div>
  </div>;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductDetail } from "@/lib/commerce/contracts";

export function ProductGallery({ product, color }: { product: ProductDetail; color: string }) {
  const media = useMemo(() => {
    const byColor = product.colorMedia?.[color];
    if (byColor?.length) return byColor;
    if (product.gallery?.length) return product.gallery;
    return product.image ? [product.image] : [];
  }, [product, color]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => { setActiveIndex(0); }, [color]);
  useEffect(() => {
    if (!viewerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerOpen(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [viewerOpen, media.length]);

  const active = media[activeIndex] ?? media[0];
  function move(direction: number) {
    if (media.length <= 1) return;
    setActiveIndex((current) => (current + direction + media.length) % media.length);
  }
  function onTouchEnd(event: React.TouchEvent) {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0]?.clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 45) return;
    move(delta < 0 ? 1 : -1);
  }

  return <div className="min-w-0">
    <div className="group relative overflow-hidden rounded-[18px_18px_6px_18px] bg-[#e7e5df]" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={onTouchEnd}>
      <button type="button" onClick={() => setViewerOpen(true)} className="block aspect-[1/1.03] w-full sm:aspect-[4/3.55] lg:aspect-[4/3.25]" aria-label={`Open ${product.name} image viewer`}>
        {active ? <img src={active} alt={`${product.name} · ${color}`} className="h-full w-full object-cover transition duration-500 [transition-timing-function:var(--ease-tcc)] group-hover:scale-[1.008]"/> : <div className="grid h-full place-items-center bg-[#16171b] text-white">THE CAP CITY</div>}
      </button>
      {media.length > 1 && <>
        <button type="button" onClick={() => move(-1)} className="tcc-gallery-arrow left-3" aria-label="Previous image">←</button>
        <button type="button" onClick={() => move(1)} className="tcc-gallery-arrow right-3" aria-label="Next image">→</button>
      </>}
      <div className="absolute bottom-3 left-3 border border-black/15 bg-white px-2.5 py-1 text-[8px] font-bold text-black shadow-sm">{String(activeIndex + 1).padStart(2,"0")} / {String(Math.max(media.length,1)).padStart(2,"0")}</div>
    </div>

    {media.length > 1 && <div className="tcc-scroll mt-2.5 flex gap-2 overflow-x-auto pb-1">{media.map((src,index) => <button key={`${src}-${index}`} type="button" onClick={() => setActiveIndex(index)} className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[10px_10px_3px_10px] border-2 transition sm:h-[74px] sm:w-[74px] ${index === activeIndex ? "border-white" : "border-transparent opacity-52 hover:opacity-100"}`} aria-label={`View image ${index+1}`}><img src={src} alt="" className="h-full w-full object-cover"/></button>)}</div>}

    {viewerOpen && <div className="fixed inset-0 z-[120] grid place-items-center bg-black/96 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Product image viewer" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewerOpen(false); }}>
      <button type="button" onClick={() => setViewerOpen(false)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white text-black shadow-lg" aria-label="Close image viewer">×</button>
      <div className="relative flex max-h-[88vh] max-w-[1100px] items-center justify-center">
        <img src={active} alt={`${product.name} enlarged`} className="max-h-[88vh] w-auto max-w-full object-contain"/>
        {media.length > 1 && <><button type="button" onClick={() => move(-1)} className="tcc-gallery-arrow left-3 sm:-left-14" aria-label="Previous image">←</button><button type="button" onClick={() => move(1)} className="tcc-gallery-arrow right-3 sm:-right-14" aria-label="Next image">→</button></>}
      </div>
    </div>}
  </div>;
}

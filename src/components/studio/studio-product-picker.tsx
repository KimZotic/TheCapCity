"use client";

import { useMemo, useState } from "react";
import type { StudioProductRecord } from "@/lib/studio/catalog-storage";
import { SearchIcon } from "@/components/icons";

export function StudioProductPicker({ products, selectedSlugs, onToggle, onMove, title="Products", publishedOnly=false }: { products: StudioProductRecord[]; selectedSlugs:string[]; onToggle:(slug:string)=>void; onMove?:(slug:string,direction:-1|1)=>void; title?:string; publishedOnly?:boolean }) {
  const [query,setQuery]=useState("");
  const [view,setView]=useState<"all"|"selected">("all");
  const available=useMemo(()=>products.filter((record)=>!record.archived&&(!publishedOnly||record.published)),[products,publishedOnly]);
  const ordered=useMemo(()=>selectedSlugs.map((slug)=>available.find((record)=>record.product.slug===slug)).filter(Boolean) as StudioProductRecord[],[selectedSlugs,available]);
  const visible=useMemo(()=>{
    const term=query.trim().toLowerCase();
    const source=view==="selected"?ordered:available;
    return source.filter((record)=>!term||`${record.product.name} ${record.product.variants.map((variant)=>variant.sku).join(" ")} ${record.product.style} ${record.product.category}`.toLowerCase().includes(term));
  },[query,view,available,ordered]);
  return <div className="overflow-hidden rounded-[15px] border border-black/[.07] bg-[#fafaf7]">
    <div className="flex flex-col gap-2 border-b border-black/[.07] p-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1"><p className="text-[8px] font-bold">{title}</p><p className="mt-1 text-[6px] text-black/30">{selectedSlugs.length} selected · {available.length} available</p></div>
      <div className="flex gap-1 rounded-[9px] bg-black/[.045] p-1">{(["all","selected"] as const).map((item)=><button key={item} onClick={()=>setView(item)} className={`rounded-[7px] px-2.5 py-1.5 text-[6px] font-bold capitalize ${view===item?"bg-white text-black shadow-sm":"text-black/38"}`}>{item}</button>)}</div>
    </div>
    <div className="border-b border-black/[.06] p-3"><label className="flex h-9 items-center gap-2 rounded-[10px] border border-black/[.08] bg-white px-3"><SearchIcon className="h-3.5 w-3.5 text-black/30"/><input value={query} onChange={(event)=>setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[8px] font-semibold outline-none placeholder:text-black/25" placeholder="Search product, style or category"/></label></div>
    <div className="tcc-scroll max-h-[330px] overflow-y-auto p-2">
      {visible.map((record)=>{const product=record.product;const checked=selectedSlugs.includes(product.slug);const order=selectedSlugs.indexOf(product.slug);return <div key={product.id} className={`mb-1.5 grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[11px] border p-2 ${checked?"border-black/15 bg-[#eef3e8]":"border-black/[.055] bg-white"}`}>
        <div className="h-10 w-10 overflow-hidden rounded-[8px] bg-[#efeee9]">{product.image?<img src={product.image} alt="" className="h-full w-full object-cover"/>:null}</div>
        <button type="button" onClick={()=>onToggle(product.slug)} className="min-w-0 text-left"><p className="truncate text-[8px] font-bold">{product.name}</p><p className="mt-1 truncate text-[6px] text-black/30">{product.style} · {record.published?"Live":"Draft"}</p></button>
        <div className="flex items-center gap-1">{checked&&onMove?<><span className="mr-1 text-[6px] font-bold text-black/28">{order+1}</span><button onClick={()=>onMove(product.slug,-1)} disabled={order<=0} className="grid h-7 w-7 place-items-center rounded-[8px] border border-black/8 bg-white disabled:opacity-20" aria-label="Move up"><svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m3 7 3-3 3 3"/></svg></button><button onClick={()=>onMove(product.slug,1)} disabled={order<0||order>=selectedSlugs.length-1} className="grid h-7 w-7 place-items-center rounded-[8px] border border-black/8 bg-white disabled:opacity-20" aria-label="Move down"><svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m3 5 3 3 3-3"/></svg></button></>:<button onClick={()=>onToggle(product.slug)} className={`min-w-8 rounded-[8px] px-2 py-1.5 text-[7px] font-bold ${checked?"bg-black text-white":"bg-black/[.045] text-black/45"}`}>{checked?"✓":"+"}</button>}</div>
      </div>})}
      {!visible.length&&<div className="grid min-h-32 place-items-center text-[7px] text-black/32">No matching products.</div>}
    </div>
  </div>;
}

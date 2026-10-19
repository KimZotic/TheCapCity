"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CampaignSummary } from "@/lib/commerce/contracts";
import { ArrowIcon } from "@/components/icons";
import { useOperations } from "@/components/commerce/operations-provider";

export function HeroCampaign({ campaign }: { campaign: CampaignSummary }) {
  const {state}=useOperations();
  const slides=useMemo(()=>state.content.heroSlides.length?state.content.heroSlides:[{id:"fallback",title:campaign.title,label:campaign.eyebrow,href:campaign.href,image:campaign.image??"",detail:campaign.image??""}],[state.content.heroSlides,campaign]);
  const [active,setActive]=useState(0);
  useEffect(()=>{if(active>=slides.length)setActive(0);},[active,slides.length]);
  useEffect(()=>{if(slides.length<=1)return;const timer=window.setInterval(()=>setActive((value)=>(value+1)%slides.length),6200);return()=>window.clearInterval(timer);},[slides.length]);
  const slide=slides[active]??slides[0]; if(!slide)return null;
  return <section className="bg-[#09090a] px-3 pb-5 pt-3 text-white min-[390px]:px-4 sm:px-6 sm:pb-7 lg:px-8 lg:pt-5">
    <div className="relative mx-auto min-h-[68svh] max-w-[1380px] overflow-hidden rounded-[28px_28px_10px_28px] border border-white/[.08] bg-[#141519] sm:min-h-[700px] lg:min-h-[720px]">
      {slides.map((item,index)=><img key={item.id} src={item.image} alt={item.title} className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] [transition-timing-function:var(--ease-tcc)] ${index===active?"scale-100 opacity-100":"scale-[1.03] opacity-0"}`}/>) }
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,.88)_0%,rgba(5,5,6,.42)_44%,rgba(5,5,6,.1)_72%),linear-gradient(0deg,rgba(5,5,6,.8)_0%,transparent_48%)]"/><div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]"/>
      <div className="relative flex min-h-[68svh] flex-col justify-between p-4 sm:min-h-[700px] sm:p-7 lg:min-h-[720px] lg:p-9"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] font-bold tracking-[.15em] text-white/52">{slide.label}</p><p className="mt-2 text-[8px] font-semibold text-white/30">A brand for <span className="text-white/60">the people</span>, by <span className="text-white/60">the people</span>.</p></div><div className="flex gap-1.5">{slides.map((item,index)=><button key={item.id} type="button" onClick={()=>setActive(index)} aria-label={`Show ${item.title}`} className={`h-1.5 rounded-full transition-all duration-300 ${index===active?"w-9 bg-[#d7ff57]":"w-1.5 bg-white/35 hover:bg-white/65"}`}/>)}</div></div>
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]"><div className="max-w-[700px]"><p className="mb-3 text-[10px] font-semibold text-white/50">0{active+1} / 0{slides.length}</p><h1 className="font-display max-w-[10ch] text-[clamp(3rem,11vw,8.5rem)] leading-[.82] tracking-[-.07em]">{slide.title}</h1><div className="mt-6 flex flex-wrap gap-2"><Link href={slide.href} className="tcc-button tcc-button-inverse group">Explore <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"/></Link><Link href="/drops" className="inline-flex min-h-11 items-center rounded-[14px_14px_5px_14px] border border-white/18 bg-black/20 px-4 text-[9px] font-bold text-white/70 transition hover:border-white/35 hover:text-white">Latest drops</Link></div></div>
          <Link href={slide.href} className="group relative hidden w-[210px] overflow-hidden rounded-[20px_20px_7px_20px] border border-white/18 bg-white p-1.5 shadow-[0_26px_80px_rgba(0,0,0,.38)] sm:block lg:w-[230px]"><div className="aspect-[4/5] overflow-hidden rounded-[15px_15px_5px_15px] bg-[#eceae3]"><img src={slide.detail} alt={`${slide.title} detail`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"/></div><div className="flex items-center justify-between px-2 py-2.5 text-black"><span className="text-[8px] font-bold">VIEW DETAIL</span><span className="grid h-7 w-7 place-items-center rounded-full bg-black text-[9px] text-white">↗</span></div></Link>
        </div>
        <div className="tcc-scroll flex gap-2 overflow-x-auto border-t border-white/12 pt-3 text-[8px] font-bold text-white/46"><Link href="/shop/headwear" className="shrink-0 rounded-full px-2 py-1.5 hover:bg-white/[.07] hover:text-white">Headwear</Link><Link href="/shop/apparel" className="shrink-0 rounded-full px-2 py-1.5 hover:bg-white/[.07] hover:text-white">Apparel</Link><Link href="/shop/special" className="shrink-0 rounded-full px-2 py-1.5 hover:bg-white/[.07] hover:text-white">Special</Link><Link href="/collections" className="shrink-0 rounded-full px-2 py-1.5 hover:bg-white/[.07] hover:text-white">Collections</Link><Link href="/payung" className="shrink-0 rounded-full px-2 py-1.5 hover:bg-white/[.07] hover:text-white">Payung Program</Link></div>
      </div>
    </div>
  </section>;
}

"use client";
import Link from "next/link";
import type { CampaignSummary } from "@/lib/commerce/contracts";
import { useOperations } from "@/components/commerce/operations-provider";
export function EditorialFeature({ campaign }: { campaign: CampaignSummary }) {
  const {state}=useOperations(); const content=state.content;
  const title=content.editorialTitle||campaign.title, copy=content.editorialCopy||campaign.copy, image=content.editorialImage||campaign.image, cta=content.editorialCta||campaign.cta, href=content.editorialHref||campaign.href;
  return <section className="bg-[#ecebe6] px-3 pb-10 min-[390px]:px-4 sm:px-6 sm:pb-12 lg:px-8"><div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[24px_24px_8px_24px] bg-[#111216] text-white lg:grid-cols-[1fr_.9fr]"><div className="relative min-h-[330px] overflow-hidden sm:min-h-[420px]">{image&&<img src={image} alt="The Cap City story" className="absolute inset-0 h-full w-full object-cover opacity-82"/>}<div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-transparent"/></div><div className="flex min-h-[300px] flex-col justify-between p-5 sm:p-8 lg:min-h-[420px] lg:p-10"><p className="max-w-[20ch] text-[12px] font-semibold leading-5 text-white/52">A brand for <span className="text-white">the people</span>, by <span className="text-white">the people</span>.</p><div><h2 className="font-display max-w-[11ch] text-[2rem] leading-[.98] sm:text-[2.7rem]">{title}</h2><p className="mt-3 max-w-md text-[11px] leading-5 text-white/54">{copy}</p><Link href={href} className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-white">{cta} <span>↗</span></Link></div></div></div></section>;
}

import Image from "next/image";
import { FashionObject } from "@/components/storefront/fashion-object";

export function CampaignArtwork() {
  return (
    <div className="relative min-h-[300px] overflow-hidden bg-[#e9ebf2] sm:min-h-[360px] lg:min-h-[500px]">
      <div className="tcc-media-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-y-0 right-0 w-[28%] bg-[#5f6dff]" />
      <div className="absolute left-[5%] top-[7%] flex items-center gap-2 text-[9px] font-bold text-black/42">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5f6dff]" /> PRODUCT STUDY / 01
      </div>
      <div className="absolute left-1/2 top-[47%] w-[84%] -translate-x-1/2 -translate-y-1/2 sm:w-[78%]">
        <FashionObject tone="#111214" detail="#ffffff" className="h-auto w-full -rotate-[4deg]" />
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-5 sm:left-5">
        <div className="relative h-7 w-11"><Image src="/brand/tcc-mark-black.png" alt="The Cap City" fill className="object-contain object-left" sizes="44px" /></div>
        <div className="h-5 w-px bg-black/15" />
        <span className="text-[9px] font-semibold text-black/40">KL / HEADWEAR / 2026</span>
      </div>
      <div className="absolute bottom-4 right-4 grid h-8 w-8 place-items-center bg-black text-[11px] font-bold text-white sm:bottom-5 sm:right-5">↗</div>
    </div>
  );
}

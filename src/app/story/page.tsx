import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArrowIcon } from "@/components/icons";

const images = {
  lead: "https://thecapcity.com/cdn/shop/files/Snapinst.app_474886423_18488021281034253_3262692847795330647_n_1080.jpg?v=1737967597&width=1080",
  detail: "https://thecapcity.com/cdn/shop/files/TCCxHikariHavoc-04.jpg?v=1739371716&width=1800",
  product: "https://thecapcity.com/cdn/shop/files/SnapInsta.to_528402220_18525292090034253_3862574897883795951_n.jpg?v=1754539474&width=1800"
};

export default function StoryPage() {
  return <main><AnnouncementBar /><SiteHeader/>
    <section className="bg-[#0b0b0d] px-3 py-4 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative min-h-[470px] overflow-hidden rounded-[24px_24px_8px_24px] bg-[#15161a] sm:min-h-[560px]">
          <img src={images.lead} alt="The Cap City" className="absolute inset-0 h-full w-full object-cover opacity-74"/>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,.86),rgba(5,5,6,.22)_62%),linear-gradient(0deg,rgba(5,5,6,.68),transparent_56%)]"/>
          <div className="relative flex min-h-[470px] max-w-xl flex-col justify-end p-5 sm:min-h-[560px] sm:p-8 lg:p-10"><h1 className="font-display text-[clamp(2.2rem,8vw,4.8rem)] leading-[.94] tracking-[-.055em]">Built around headwear.</h1><p className="mt-4 max-w-md text-[11px] leading-5 text-white/58">The Cap City brings headwear, apparel, collaborations and release culture into one evolving rotation.</p><Link href="/shop" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-[13px_13px_4px_13px] bg-white px-4 text-[9px] font-bold text-black">Shop the rotation <ArrowIcon className="h-3.5 w-3.5"/></Link></div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#15161a] p-5 sm:p-6"><h2 className="font-display text-[1.7rem] leading-[.98]">Headwear first. Never headwear only.</h2><p className="mt-3 max-w-md text-[9px] leading-5 text-white/42">The new digital flagship keeps caps at the centre while giving apparel, special items, collaborations, Payung and future releases room to grow without turning the store into a generic catalogue.</p></div>
          <div className="grid grid-cols-2 gap-3"><div className="relative min-h-[260px] overflow-hidden rounded-[20px_20px_7px_20px]"><img src={images.detail} alt="TCC collaboration" className="absolute inset-0 h-full w-full object-cover"/></div><div className="relative min-h-[260px] overflow-hidden rounded-[20px_20px_7px_20px]"><img src={images.product} alt="TCC product culture" className="absolute inset-0 h-full w-full object-cover"/></div></div>
        </div>
      </div>
    </section>
  <SiteFooter/></main>;
}

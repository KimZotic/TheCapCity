import Link from "next/link";
import { PayungRewardDetail } from "@/components/account/payung-reward-detail";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default async function PayungRewardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main className="bg-[#0b0b0d] text-white">
    <AnnouncementBar/><SiteHeader/>
    <section className="px-3 py-4 min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-6"><div className="mx-auto max-w-[1320px]"><div className="mb-3 flex items-center gap-2 text-[8px] font-semibold text-white/32"><Link href="/payung" className="hover:text-white">Payung Program</Link><span>/</span><span>Reward</span></div><PayungRewardDetail slug={slug}/></div></section>
    <SiteFooter/>
  </main>;
}

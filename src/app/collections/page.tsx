import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LiveCollectionsGrid } from "@/components/storefront/live-collections-grid";
import { getCollections } from "@/lib/services/commerce-service";

export default async function CollectionsPage() {
  const collections = await getCollections();
  return <main className="bg-[#0b0b0d] text-white"><AnnouncementBar /><SiteHeader/><section className="px-3 py-6 min-[390px]:px-4 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto max-w-[1280px]"><header className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><h1 className="font-display text-[clamp(1.8rem,5vw,2.7rem)] leading-none">Collections.</h1><p className="max-w-[38ch] text-[9px] leading-4 text-white/40">Curated releases, collaborations and product stories.</p></header><LiveCollectionsGrid initialCollections={collections}/></div></section><SiteFooter/></main>;
}

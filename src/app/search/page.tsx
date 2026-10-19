import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LiveSearchResults } from "@/components/search/live-search-results";
import { getCollections, getDrops, searchProducts } from "@/lib/services/commerce-service";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const normalized = q.trim().toLowerCase();
  const [products, allCollections, allDrops] = await Promise.all([searchProducts(q), getCollections(), getDrops()]);
  const collections = normalized ? allCollections.filter((item) => [item.title,item.shortTitle,item.description,item.kicker].some((value) => value.toLowerCase().includes(normalized))) : [];
  const drops = normalized ? allDrops.filter((item) => [item.title,item.kicker,item.description,item.status].some((value) => value.toLowerCase().includes(normalized))) : [];

  return <main className="bg-[#0b0b0d] text-white"><AnnouncementBar /><SiteHeader/><section className="min-h-[66vh] px-3 py-6 min-[390px]:px-4 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto max-w-[1280px]">
    <div className="grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[1fr_520px] lg:items-end"><div><h1 className="font-display max-w-[18ch] text-[clamp(1.75rem,5vw,2.6rem)] leading-[1]">{q ? `Results for “${q}”` : "Search TCC."}</h1></div><form className="flex overflow-hidden rounded-[16px_16px_5px_16px] border border-white/12 bg-white/[.06] p-1.5" action="/search"><input name="q" defaultValue={q} placeholder="Products, collections, drops" className="min-w-0 flex-1 bg-transparent px-3 text-[11px] font-semibold text-white outline-none placeholder:text-white/25"/><button type="submit" className="rounded-[11px_11px_4px_11px] bg-white px-4 py-2.5 text-[8px] font-bold text-black">Search</button></form></div>
    <LiveSearchResults query={q} initialProducts={products} initialCollections={collections} drops={drops}/>
  </div></section><SiteFooter/></main>;
}

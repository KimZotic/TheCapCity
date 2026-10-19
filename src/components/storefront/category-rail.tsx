import Link from "next/link";
import type { CategorySummary } from "@/lib/commerce/contracts";

const visualMap: Record<string, string> = {
  Headwear: "https://thecapcity.com/cdn/shop/files/KL_Legacy_Cover_Sizing.jpg?v=1759810800&width=1600",
  Apparel: "https://thecapcity.com/cdn/shop/files/TCC_Waving_Flag_Sandstorm_ORG_-_Back.jpg?v=1780021665&width=1080",
  Special: "https://thecapcity.com/cdn/shop/files/Crest_Ring_Desk.jpg?v=1790061973&width=1200",
  Collections: "https://thecapcity.com/cdn/shop/files/Snapinst.app_474886423_18488021281034253_3262692847795330647_n_1080.jpg?v=1737967597&width=1200",
};

const secondaryLinks: Record<string, [string,string][]> = {
  Headwear: [["All styles","/shop/headwear"],["Flat brim","/shop/flat-brim"],["Curved brim","/shop/curved-brim"],["Fitted","/shop/fitted"],["Other styles","/shop/other-styles"]],
  Apparel: [["Tops","/shop/tops"],["Bottoms","/shop/bottoms"]],
  Special: [["Shop all","/shop/special"],["Cap accessories","/shop/cap-accessories"],["Bags","/shop/bags"],["Gift card","/shop/gift-card"],["Others","/shop/others"]],
  Collections: [["KL Legacy","/collections/kl-legacy"],["Drops","/drops"]],
};

export function CategoryRail({ categories }: { categories: CategorySummary[] }) {
  return (
    <section className="bg-[#09090a] px-3 py-10 text-white min-[390px]:px-4 sm:px-6 sm:py-13 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-5 flex items-end justify-between gap-4"><h2 className="font-display text-[1.55rem] sm:text-[1.9rem]">Shop the range.</h2><Link href="/shop" className="pb-1 text-[9px] font-semibold text-white/40 transition hover:text-white">View all ↗</Link></div>
        <div className="grid items-start gap-3 md:grid-cols-12">
          {categories.map((category,index) => {
            const links = secondaryLinks[category.label] ?? [];
            const span = index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5";
            return <article key={category.id} className={`group self-start overflow-hidden rounded-[22px_22px_7px_22px] border border-white/[.09] bg-[#15161a] ${span}`}>
              <Link href={category.href} className="relative block aspect-[16/10] overflow-hidden sm:aspect-[16/8.5]">
                <img src={visualMap[category.label]} alt={category.label} className="absolute inset-0 h-full w-full object-cover transition duration-700 [transition-timing-function:var(--ease-tcc)] group-hover:scale-[1.022]"/>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(0,0,0,.72))]"/>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-5 sm:bottom-5"><div><h3 className="text-[20px] font-semibold tracking-[-.04em] sm:text-[24px]">{category.label}</h3><p className="mt-1 max-w-[38ch] text-[8px] font-medium text-white/55">{category.kicker}</p></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[12px] text-black shadow-lg transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span></div>
              </Link>
              <div className="tcc-scroll flex gap-1 overflow-x-auto border-t border-white/[.08] px-3 py-2.5">{links.map(([label,href]) => <Link key={href} href={href} className="shrink-0 rounded-full px-2.5 py-1.5 text-[8px] font-semibold text-white/44 transition hover:bg-white/[.06] hover:text-white">{label}</Link>)}</div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

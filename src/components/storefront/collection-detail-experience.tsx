"use client";

import Link from "next/link";
import type { CollectionDetail, CollectionSummary } from "@/lib/commerce/contracts";
import { ProductCard } from "@/components/storefront/product-card";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { productToSummary } from "@/lib/studio/catalog-storage";

export function CollectionDetailExperience({ slug, initialCollection }: { slug: string; initialCollection: CollectionDetail | null }) {
  const { state } = useCatalog();
  const live = state.collections.find((item) => item.slug === slug || item.id === initialCollection?.id);
  const collection: CollectionSummary | null = live ?? initialCollection;
  if (!collection || live?.published === false || live?.archived === true) return <section className="px-3 py-6 min-[390px]:px-4 sm:px-6 lg:px-8"><div className="mx-auto grid min-h-[56vh] max-w-[1280px] place-items-center rounded-[22px] border border-white/10 bg-[#15161a] p-8 text-center"><div><p className="font-display text-[28px]">Collection unavailable.</p><p className="mt-2 text-[9px] text-white/40">This collection is hidden or no longer published.</p><Link href="/collections" className="mt-5 inline-flex min-h-11 items-center rounded-[12px] bg-white px-4 text-[9px] font-bold text-black">All collections ↗</Link></div></div></section>;

  const products = collection.productSlugs.flatMap((productSlug) => {
    const record = state.products.find((item) => item.product.slug === productSlug && item.published && !item.archived);
    if (record) return [productToSummary(record.product)];
    const fallback = initialCollection?.products.find((item) => item.slug === productSlug);
    return fallback ? [fallback] : [];
  });

  return <section className="px-3 py-4 min-[390px]:px-4 sm:px-6 sm:py-6 lg:px-8"><div className="mx-auto max-w-[1280px]"><Link href="/collections" className="text-[8px] font-bold uppercase tracking-[.09em] text-white/35 hover:text-white">← Collections</Link>
    <div className="relative mt-3 min-h-[430px] overflow-hidden rounded-[26px_26px_9px_26px] border border-white/10 bg-[#17181c] sm:min-h-[500px] lg:min-h-[560px]">
      {collection.image ? <img src={collection.image} alt="" className="absolute inset-0 h-full w-full object-cover"/> : null}<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,8,.88)_0%,rgba(7,7,8,.56)_44%,rgba(7,7,8,.12)_78%),linear-gradient(0deg,rgba(7,7,8,.64),transparent_55%)]"/><div className="tcc-hero-noise absolute inset-0 opacity-45"/>
      <div className="relative z-10 flex min-h-[430px] max-w-[520px] flex-col justify-between p-5 sm:min-h-[500px] sm:p-7 lg:min-h-[560px] lg:p-9"><div className="flex items-center gap-2"><span className="rounded-[9px_9px_3px_9px] border border-white/14 bg-black/30 px-2 py-1 text-[7px] font-bold uppercase tracking-[.1em] text-white/60">{collection.kicker}</span><span className="text-[7px] font-bold uppercase tracking-[.1em] text-white/32">{products.length} pieces</span></div><div><h1 className="font-display max-w-[12ch] text-[clamp(2.15rem,7vw,4.4rem)] leading-[.92] tracking-[-.06em]">{collection.title}</h1><p className="mt-3 max-w-[42ch] text-[10px] leading-5 text-white/52">{collection.description}</p><div className="mt-5 flex flex-wrap gap-2"><Link href="#collection-products" className="tcc-button tcc-button-inverse">Shop the edit <span>↓</span></Link><Link href="/shop" className="rounded-[14px_14px_5px_14px] border border-white/15 bg-black/20 px-4 py-3 text-[9px] font-bold">Shop all</Link></div></div><span /></div>
    </div>
    <section id="collection-products" className="py-8 sm:py-10"><div className="flex items-end justify-between gap-4"><h2 className="font-display text-[1.45rem] sm:text-[1.75rem]">Selected for this collection.</h2><Link href="/shop" className="text-[8px] font-bold uppercase tracking-[.08em] text-white/35 hover:text-white">Shop all ↗</Link></div>{products.length ? <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-4 lg:grid-cols-4">{products.map((product,index) => <ProductCard key={product.id} product={product} index={index}/>)}</div> : <div className="mt-4 rounded-[16px] border border-white/10 p-6 text-[9px] text-white/38">No published products are assigned to this collection.</div>}</section>
  </div></section>;
}

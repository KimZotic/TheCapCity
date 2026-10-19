"use client";
import Link from "next/link";
import type { ProductSummary } from "@/lib/commerce/contracts";
import { ProductCard } from "@/components/storefront/product-card";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { useOperations } from "@/components/commerce/operations-provider";

export function LatestDrop({ products: fallback }: { products: ProductSummary[] }) {
  const {state:catalog}=useCatalog(); const {state}=useOperations();
  const products=state.content.latestDropSlugs.flatMap((slug)=>{const record=catalog.products.find((item)=>item.product.slug===slug&&item.published&&!item.archived);return record?[record.product]:[]});
  const resolved=products.length?products:fallback;
  return <section className="bg-[#ecebe6] px-3 py-9 text-[#111216] min-[390px]:px-4 sm:px-6 sm:py-12 lg:px-8"><div className="mx-auto max-w-[1380px]"><div className="mb-5 flex items-end justify-between gap-4"><h2 className="font-display text-[1.55rem] leading-tight sm:text-[1.9rem]">Fresh on the wall.</h2><Link href="/shop" className="pb-1 text-[9px] font-semibold text-black/44 transition hover:text-black">Shop all ↗</Link></div><div className="tcc-scroll -mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-1 min-[390px]:-mx-4 min-[390px]:px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">{resolved.map((product,index)=><div key={product.id} className="w-[66vw] max-w-[245px] shrink-0 snap-start sm:w-auto sm:max-w-none"><ProductCard product={product} index={index}/></div>)}</div></div></section>;
}

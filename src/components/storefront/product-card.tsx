"use client";

import Link from "next/link";
import type { ProductSummary } from "@/lib/commerce/contracts";
import { ProductArtwork } from "@/components/storefront/product-artwork";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { productToSummary } from "@/lib/studio/catalog-storage";

const stateLabel: Partial<Record<ProductSummary["state"], string>> = {
  new: "Latest",
  limited: "Limited",
  restock: "Restock",
  "sold-out": "Sold out"
};

export function ProductCard({ product: initialProduct, index = 0 }: { product: ProductSummary; index?: number }) {
  const { state } = useCatalog();
  const record = state.products.find((item) => item.product.id === initialProduct.id || item.product.slug === initialProduct.slug);
  if (record && (!record.published || record.archived)) return null;
  const product = record ? productToSummary(record.product) : initialProduct;
  const badge = stateLabel[product.state];
  return (
    <article className="tcc-product-card h-full min-w-0">
      <Link href={`/products/${product.slug}`} className="tcc-product-card-shell tcc-focus-ring group flex h-full min-h-[100%] flex-col text-[#111216] focus:outline-none">
        <div className="relative shrink-0 overflow-hidden bg-[#efeee9]">
          <ProductArtwork product={product} index={index}/>
          {badge && <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-1 text-[7px] font-bold shadow-sm ${product.state === "sold-out" ? "bg-black text-white" : "border border-black/[.08] bg-white/95 text-black"}`}>{badge}</span>}
          <span className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-black/[.08] bg-white/94 text-[11px] text-black shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </div>
        <div className="flex min-h-[92px] flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:min-h-[102px] sm:px-4 sm:pb-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <h3 className="line-clamp-2 min-h-[2.65em] text-[11px] font-semibold leading-[1.32] tracking-[-.018em] sm:text-[12px]">{product.name}</h3>
            <div className="shrink-0 text-right"><p className="text-[10px] font-bold tracking-[-.01em] sm:text-[11px]">{product.style === "Gift Card" ? "From " : ""}RM{product.price.amount.toFixed(0)}</p>{product.compareAt&&product.compareAt>product.price.amount?<p className="mt-0.5 text-[7px] font-semibold text-black/30 line-through">RM{product.compareAt.toFixed(0)}</p>:null}</div>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/[.07] pt-2.5">
            <p className="truncate text-[8px] font-medium text-black/42">{product.style}</p>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/18 transition group-hover:bg-black/60"/>
          </div>
        </div>
      </Link>
    </article>
  );
}

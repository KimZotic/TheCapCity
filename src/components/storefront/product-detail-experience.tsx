"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductDetail } from "@/lib/commerce/contracts";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/commerce/product-purchase-panel";
import { useCatalog } from "@/components/commerce/catalog-provider";

export function ProductDetailExperience({ product: initialProduct, slug }: { product: ProductDetail | null; slug: string }) {
  const { state } = useCatalog();
  const record = state.products.find((item) => item.product.slug === slug || item.product.id === initialProduct?.id);
  const product = record?.product ?? initialProduct;

  const colors = useMemo(() => product ? Array.from(new Set(product.variants.map((variant) => variant.color))) : [], [product]);
  const firstColor = product ? (colors.find((value) => product.variants.some((variant) => variant.color === value && variant.stock > 0)) ?? colors[0] ?? "") : "";
  const [selectedColor, setSelectedColor] = useState("");
  const color = colors.includes(selectedColor) ? selectedColor : firstColor;

  if (!product || record?.published === false || record?.archived === true) return <div className="grid min-h-[54vh] place-items-center rounded-[22px] border border-white/10 bg-[#15161a] p-8 text-center"><div><p className="font-display text-[28px]">Product unavailable.</p><p className="mt-2 text-[9px] text-white/40">This item is hidden or no longer available in the current catalogue.</p><Link href="/shop" className="mt-5 inline-flex min-h-11 items-center rounded-[12px] bg-white px-4 text-[9px] font-bold text-black">Back to shop ↗</Link></div></div>;

  return <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:gap-6">
    <ProductGallery product={product} color={color}/>
    <aside className="rounded-[22px_22px_8px_22px] bg-[#f1f0eb] p-4 text-black min-[390px]:p-5 lg:sticky lg:top-[82px]"><ProductPurchasePanel product={product} color={color} onColorChange={setSelectedColor}/></aside>
  </div>;
}

"use client";

import Link from "next/link";
import type { CartLine as CartLineType } from "@/components/commerce/cart-provider";
import { useCart } from "@/components/commerce/cart-provider";

function Price({ line }: { line: CartLineType }) {
  if (line.pricingMode === "points") return <span>{((line.unitPoints ?? 0) * line.quantity).toLocaleString()} pts</span>;
  return <span>RM{(line.unitPrice * line.quantity).toFixed(0)}</span>;
}

export function CartLine({ line, compact = false }: { line: CartLineType; compact?: boolean }) {
  const { setQuantity, removeItem, closeCart } = useCart();
  const href = line.pricingMode === "points" ? `/payung/rewards/${line.slug}` : `/products/${line.slug}`;
  return (
    <article className={`grid grid-cols-[70px_minmax(0,1fr)] gap-3 border-b border-black/[.08] py-3.5 ${compact ? "sm:grid-cols-[74px_minmax(0,1fr)]" : "sm:grid-cols-[98px_minmax(0,1fr)] sm:gap-4 sm:py-4"}`}>
      <Link href={href} onClick={closeCart} className="group relative aspect-square overflow-hidden rounded-[14px_14px_5px_14px] bg-[#e1e0db]">
        {line.image ? <img src={line.image} alt={line.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/> : <div className="grid h-full place-items-center bg-black text-[9px] font-bold text-white">TCC</div>}
      </Link>
      <div className="flex min-w-0 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={href} onClick={closeCart} className="block text-[11px] font-semibold leading-[1.3] hover:opacity-60 sm:text-[12px]">{line.name}</Link><p className="mt-1 truncate text-[8px] font-medium text-black/40">{line.variantLabel}</p></div><p className="shrink-0 text-[10px] font-bold"><Price line={line}/></p></div>
        <div className="mt-3 flex items-center justify-between gap-3">{line.pricingMode === "points" ? <span className="rounded-full bg-[#d7ff57] px-2.5 py-1 text-[7px] font-bold text-black">Payung reward</span> : <div className="flex h-8 items-center overflow-hidden rounded-[10px_10px_4px_10px] border border-black/[.10] bg-white"><button aria-label={`Decrease ${line.name} quantity`} className="grid h-full w-8 place-items-center text-[12px] hover:bg-black hover:text-white" onClick={() => setQuantity(line.key, line.quantity - 1)}>−</button><span className="grid h-full min-w-7 place-items-center border-x border-black/[.07] px-1 text-[8px] font-bold">{line.quantity}</span><button aria-label={`Increase ${line.name} quantity`} className="grid h-full w-8 place-items-center text-[12px] hover:bg-black hover:text-white disabled:opacity-25" disabled={line.quantity >= line.availableStock} onClick={() => setQuantity(line.key, line.quantity + 1)}>+</button></div>}<button onClick={() => removeItem(line.key)} className="text-[8px] font-semibold text-black/34 transition hover:text-[#c9412d]">Remove</button></div>
      </div>
    </article>
  );
}

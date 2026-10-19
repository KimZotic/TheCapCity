"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductDetail } from "@/lib/commerce/contracts";
import { useCart } from "@/components/commerce/cart-provider";
import { useAccount } from "@/components/account/account-provider";

const stateLabel: Partial<Record<ProductDetail["state"], string>> = { new: "Latest", limited: "Limited", restock: "Restock", "sold-out": "Sold out" };

export function ProductPurchasePanel({ product, color, onColorChange }: { product: ProductDetail; color: string; onColorChange: (color: string) => void }) {
  const router = useRouter();
  const { addItem, closeCart } = useCart();
  const { customer } = useAccount();
  const colors = useMemo(() => Array.from(new Set(product.variants.map((variant) => variant.color))), [product.variants]);
  const sizes = useMemo(() => Array.from(new Set(product.variants.filter((variant) => variant.color === color).map((variant) => variant.size))), [product.variants, color]);
  const firstAvailableSize = useMemo(() => product.variants.find((variant) => variant.color === color && variant.stock > 0)?.size ?? sizes[0] ?? "", [product.variants, color, sizes]);
  const [size, setSize] = useState(firstAvailableSize);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const activeSize = sizes.includes(size) ? size : firstAvailableSize;
  const selectedVariant = product.variants.find((variant) => variant.color === color && variant.size === activeSize) ?? null;
  const activePrice = selectedVariant?.priceOverride ?? product.price.amount;
  const optionLabel = product.style === "Gift Card" ? "Amount" : product.style === "Cap Accessories" ? "Specification" : "Colour";
  const showSize = product.style === "Fitted" || product.category === "Apparel" || product.style === "Bottoms" || product.style === "Tops" || (sizes.length > 1 && !sizes.every((value) => value === "ONE" || value === "OS" || value === "OSFM" || value === "Digital"));
  const maxQty = Math.max(selectedVariant?.stock ?? 0, 1);
  const soldOut = !selectedVariant || selectedVariant.stock <= 0 || product.state === "sold-out";
  const selectedImage = product.colorMedia?.[color]?.[0] ?? product.image;

  function selectColor(nextColor: string) {
    onColorChange(nextColor);
    const next = product.variants.find((variant) => variant.color === nextColor && variant.stock > 0) ?? product.variants.find((variant) => variant.color === nextColor);
    setSize(next?.size ?? ""); setQuantity(1); setMessage("");
  }
  function selectSize(nextSize: string) { setSize(nextSize); setQuantity(1); setMessage(""); }
  function handleAdd() { if (!selectedVariant || soldOut) return; const result = addItem(product, selectedVariant, quantity, selectedImage); setMessage(result.message); }
  function handleBuyNow() { if (!selectedVariant || soldOut) return; const result = addItem(product, selectedVariant, quantity, selectedImage); setMessage(result.message); if (!result.ok) return; closeCart(); router.push("/checkout"); }

  return <div>
    <div className="flex items-center justify-between gap-3"><p className="text-[9px] font-semibold text-black/42">{product.style}</p>{stateLabel[product.state] && <span className="text-[7px] font-semibold text-black/38">{stateLabel[product.state]}</span>}</div>
    <h1 className="font-display mt-2 text-[clamp(1.6rem,7vw,2.15rem)] leading-[1] tracking-[-.045em]">{product.name}</h1>
    <div className="mt-3 flex items-center justify-between gap-4"><p className="text-[17px] font-bold">RM{activePrice.toFixed(2)}</p>{customer ? <Link href="/payung" className="text-[8px] font-semibold text-black/38 hover:text-black">Earn {Math.round(activePrice * 3)} Payung pts ↗</Link> : <Link href="/account" className="text-[8px] font-semibold text-black/38 hover:text-black">Log in to earn points ↗</Link>}</div>
    <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold">{optionLabel}</p><span className="text-[8px] font-medium text-black/40">{color}</span></div><div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">{colors.map((value) => { const hasStock = product.variants.some((variant) => variant.color === value && variant.stock > 0); const active = color === value; return <button key={value} type="button" disabled={!hasStock} onClick={() => selectColor(value)} className={`min-h-10 rounded-[12px_12px_4px_12px] border px-3 text-[8px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-28 ${active ? "border-black bg-black text-white" : "border-black/[.10] bg-[#fcfcfa] hover:border-black/28"}`}>{value}</button>; })}</div></div>

    {showSize && <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold">Size</p><button type="button" onClick={() => setGuideOpen((open) => !open)} className="text-[8px] font-semibold text-black/38 hover:text-black">{guideOpen ? "Close guide" : "Size guide"} ↗</button></div><div className="mt-2 flex flex-wrap gap-1.5">{sizes.map((value) => { const variant = product.variants.find((item) => item.color === color && item.size === value); const available = Boolean(variant && variant.stock > 0); const active = activeSize === value; return <button key={value} type="button" disabled={!available} onClick={() => selectSize(value)} className={`relative min-h-10 min-w-[46px] rounded-[11px_11px_4px_11px] border px-3 text-[8px] font-semibold disabled:cursor-not-allowed disabled:opacity-25 ${active ? "border-black bg-black text-white" : "border-black/[.10] bg-[#fcfcfa]"}`}>{value}{!available && <span className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] bg-current"/>}</button>; })}</div>{guideOpen && <div className="mt-2.5 rounded-[14px_14px_5px_14px] bg-[#e4e3dd] p-3"><p className="text-[8px] leading-4 text-black/52">{product.style === "Fitted" ? "Measure around the widest part of your head, just above the ears. Choose the closest fitted size; if you sit between sizes, size up." : product.category === "Apparel" ? "Choose your usual size for the intended fit. Product-specific measurements will replace demo guidance when final product data is supplied." : "Adjustable one-size profiles fit most adult head sizes. Fine-tune the fit using the rear closure."}</p></div>}</div>}

    <div className="mt-5 flex items-center justify-between gap-3 border-y border-black/[.08] py-3"><div><p className={`text-[9px] font-semibold ${soldOut ? "text-[#c9412d]" : "text-black/72"}`}>{soldOut ? "Currently sold out" : selectedVariant && selectedVariant.stock <= 3 ? `Low stock · ${selectedVariant.stock} left` : "In stock"}</p></div><div className="flex h-9 items-center overflow-hidden rounded-[11px_11px_4px_11px] border border-black/[.10] bg-[#fcfcfa]"><button type="button" aria-label="Decrease quantity" className="grid h-full w-9 place-items-center text-[12px]" onClick={() => setQuantity((value) => Math.max(1,value-1))}>−</button><span className="grid h-full min-w-8 place-items-center border-x border-black/[.08] px-1 text-[9px] font-bold">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={soldOut || quantity >= maxQty} className="grid h-full w-9 place-items-center text-[12px] disabled:opacity-25" onClick={() => setQuantity((value) => Math.min(maxQty,value+1))}>+</button></div></div>

    <div className="sticky bottom-2 z-10 -mx-1 mt-4 grid grid-cols-[1fr_.85fr] gap-2 rounded-[16px_16px_6px_16px] bg-[#f1f0eb]/95 p-1 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0"><button type="button" disabled={soldOut} onClick={handleAdd} className="tcc-pressable min-h-[48px] rounded-[13px_13px_5px_13px] bg-black px-4 text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:bg-black/25">{soldOut ? "Unavailable" : "Add to cart"}</button><button type="button" disabled={soldOut} onClick={handleBuyNow} className="tcc-pressable min-h-[48px] rounded-[13px_13px_5px_13px] border border-black bg-transparent px-4 text-[9px] font-bold disabled:cursor-not-allowed disabled:opacity-30">Buy now</button></div>
    <div aria-live="polite" className="min-h-5 pt-1.5 text-[8px] font-semibold text-[#4d58df]">{message}</div>

    <div className="mt-1 divide-y divide-black/[.07] border-y border-black/[.08]">
      <details className="group py-3"><summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-semibold"><span>Details</span><span className="text-black/35 transition group-open:rotate-45">+</span></summary><div className="mt-3 text-[8px] leading-4 text-black/50"><p>{product.description}</p><ul className="mt-2 space-y-1.5">{product.details.map((detail) => <li key={detail}>• {detail}</li>)}</ul></div></details>
      <details className="group py-3"><summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-semibold"><span>Product specification</span><span className="text-black/35 transition group-open:rotate-45">+</span></summary><div className="mt-3 grid gap-2 text-[8px] leading-4 text-black/50">{[["Material",product.material],["Fit",product.fit],["Brim",product.brim],["Closure",product.closure]].map(([label,value]) => <div key={label} className="grid grid-cols-[68px_1fr] gap-2"><span className="text-black/30">{label}</span><span className="font-semibold text-black/62">{value}</span></div>)}</div></details>
      <details className="group py-3"><summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-semibold"><span>Delivery, pickup & returns</span><span className="text-black/35 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-[8px] leading-4 text-black/48">Choose delivery or TCC flagship pickup at checkout. Shipping rates and the final return policy will follow approved production rules.</p></details>
    </div>
  </div>;
}

"use client";

import Link from "next/link";
import { FormEvent, useState, type ChangeEvent } from "react";
import { CartLine } from "@/components/commerce/cart-line";
import { useCart } from "@/components/commerce/cart-provider";
import { useAccount } from "@/components/account/account-provider";

function money(value: number) { return `RM${value.toFixed(2)}`; }

export function CartPageView() {
  const { items, count, subtotal, pointsTotal, cartMode, discount, total, promo, applyPromo, removePromo, clearCart } = useCart();
  const { customer } = useAccount();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const isPoints = cartMode === "points";
  function submitPromo(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const result = applyPromo(promoInput); setPromoMessage(result.message); if (result.ok) setPromoInput(""); }

  if (!items.length) return <section className="min-h-[68vh] bg-[#0b0b0d] px-3 py-12 text-white min-[390px]:px-4 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-[1180px] place-items-center py-14 text-center"><div><h1 className="font-display text-[clamp(1.8rem,6vw,2.8rem)]">Your bag is empty.</h1><Link href="/shop" className="tcc-button tcc-button-inverse mt-5">Shop products <span>↗</span></Link></div></div></section>;

  return <section className="bg-[#0b0b0d] px-3 py-6 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-9"><div className="mx-auto max-w-[1240px]">
    <header className="flex items-end justify-between gap-4 border-b border-white/10 pb-5"><h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-none">{isPoints ? "Payung bag" : "Bag"} <span className="text-white/28">({count})</span></h1><button onClick={clearCart} className="text-[8px] font-semibold text-white/35 hover:text-white">Clear bag</button></header>
    <div className="grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
      <div className="rounded-[22px_22px_8px_22px] bg-[#f1f0eb] px-3 text-black sm:px-4">{items.map((line) => <CartLine key={line.key} line={line}/>)}</div>
      <aside className="h-fit rounded-[22px_22px_8px_22px] border border-white/10 bg-[#16171b] p-4 lg:sticky lg:top-[84px]">
        <div className="flex items-center justify-between"><p className="text-[12px] font-semibold">{isPoints ? "Redemption summary" : "Order summary"}</p>{customer ? <Link href="/account" className="text-[8px] font-semibold text-[#d7ff57]">{customer.firstName} · Payung Program ↗</Link> : <Link href="/account" className="text-[8px] font-semibold text-white/40 hover:text-white">Log in ↗</Link>}</div>
        {isPoints ? <div className="mt-4 space-y-2.5 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-white/42">Reward total</span><span>{pointsTotal.toLocaleString()} pts</span></div><div className="flex justify-between"><span className="text-white/42">Available</span><span className={customer && customer.points >= pointsTotal ? "text-[#d7ff57]" : "text-[#ff8875]"}>{customer ? `${customer.points.toLocaleString()} pts` : "Log in required"}</span></div><div className="flex justify-between border-t border-white/10 pt-3 text-[15px] font-bold"><span>Pay with</span><span>Payung Points</span></div></div> : <><div className="mt-4 space-y-2.5 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-white/42">Subtotal</span><span>{money(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-[#d7ff57]"><span>{promo?.code}</span><span>−{money(discount)}</span></div>}<div className="flex justify-between"><span className="text-white/42">Delivery</span><span className="text-white/55">Calculated at checkout</span></div><div className="flex justify-between border-t border-white/10 pt-3 text-[15px] font-bold"><span>Total</span><span>{money(total)}</span></div></div><form onSubmit={submitPromo} className="mt-5 border-t border-white/10 pt-4"><label htmlFor="promo" className="text-[8px] font-semibold text-white/38">Promo code</label>{promo ? <div className="mt-2 flex min-h-10 items-center justify-between rounded-[12px_12px_4px_12px] border border-white/10 bg-white/[.05] px-3 text-[9px] font-bold"><span>{promo.code} · {promo.kind === "percent" ? `${promo.value}% OFF` : `RM${promo.value.toFixed(2)} OFF`}</span><button type="button" onClick={removePromo} className="text-[8px] text-white/40 hover:text-white">Remove</button></div> : <div className="mt-2 flex overflow-hidden rounded-[12px_12px_4px_12px] border border-white/10 bg-white/[.05]"><input id="promo" value={promoInput} onChange={(event: ChangeEvent<HTMLInputElement>) => setPromoInput(event.target.value)} placeholder="Promo code" className="min-w-0 flex-1 bg-transparent px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/25"/><button type="submit" className="bg-white px-4 py-3 text-[8px] font-bold text-black">Apply</button></div>}<p aria-live="polite" className="mt-2 min-h-4 text-[8px] leading-4 text-white/34">{promoMessage}</p></form></>}
        <Link href="/checkout" className="tcc-shine mt-5 flex min-h-12 items-center justify-between rounded-[14px_14px_5px_14px] bg-white px-4 text-[10px] font-bold text-black"><span>{isPoints ? "Continue redemption" : "Checkout"}</span><span>↗</span></Link>
      </aside>
    </div>
  </div></section>;
}

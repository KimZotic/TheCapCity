"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { CartLine } from "@/components/commerce/cart-line";
import { useCart } from "@/components/commerce/cart-provider";
import { useAccount } from "@/components/account/account-provider";

function money(value: number) { return `RM${value.toFixed(2)}`; }

export function CartDrawer() {
  const { items, count, subtotal, pointsTotal, cartMode, discount, total, promo, isCartOpen, closeCart } = useCart();
  const { customer } = useAccount();
  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [isCartOpen, closeCart]);

  const isPoints = cartMode === "points";
  return (
    <div className={`fixed inset-0 z-[100] ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!isCartOpen}>
      <button aria-label="Close bag overlay" onClick={closeCart} className={`absolute inset-0 bg-black/58 transition-opacity duration-200 ${isCartOpen ? "opacity-100" : "opacity-0"}`}/>
      <aside role="dialog" aria-modal="true" aria-label={isPoints ? "Payung redemption bag" : "Shopping bag"} className={`absolute bottom-[5dvh] right-2 top-[5dvh] flex w-[min(78vw,340px)] flex-col overflow-hidden rounded-[22px_22px_8px_22px] bg-[#f1f0eb] shadow-[-18px_0_55px_rgba(0,0,0,.22)] will-change-transform transition-transform duration-[240ms] [transition-timing-function:var(--ease-tcc)] sm:bottom-3 sm:right-3 sm:top-3 sm:w-[min(86vw,380px)] ${isCartOpen ? "translate-x-0" : "translate-x-[112%]"}`}>
        <div className="flex min-h-[58px] shrink-0 items-center justify-between border-b border-black/[.08] px-4">
          <div><p className="text-[12px] font-semibold">{isPoints ? "Payung bag" : "Bag"}</p><p className="mt-0.5 text-[8px] text-black/38">{count} item{count === 1 ? "" : "s"}{isPoints ? ` · ${pointsTotal.toLocaleString()} pts` : ""}</p></div>
          <button className="grid h-9 w-9 place-items-center rounded-[12px_12px_4px_12px] border border-black/10 bg-white/55" onClick={closeCart} aria-label="Close bag"><CloseIcon className="h-[15px] w-[15px]"/></button>
        </div>
        <div className="tcc-scroll flex-1 overflow-y-auto px-3">
          {items.length ? items.map((line) => <CartLine key={line.key} line={line} compact />) : <div className="grid min-h-[48vh] place-items-center px-6 py-12 text-center"><div><h2 className="font-display text-[1.45rem]">Your bag is empty.</h2><Link href="/shop" onClick={closeCart} className="tcc-button mt-5">Browse products <span>↗</span></Link></div></div>}
        </div>
        {items.length > 0 && <div className="tcc-safe-bottom shrink-0 border-t border-black/[.08] bg-[#fcfcfa] px-4 pt-3">
          {isPoints ? <div className="space-y-1.5 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-black/42">Reward total</span><span>{pointsTotal.toLocaleString()} pts</span></div><div className="flex justify-between"><span className="text-black/42">Delivery / pickup</span><span className="text-black/55">Choose at checkout</span></div></div> : <div className="space-y-1.5 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-black/42">Subtotal</span><span>{money(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-[#4d58df]"><span>{promo?.code}</span><span>−{money(discount)}</span></div>}<div className="flex justify-between"><span className="text-black/42">Delivery</span><span className="text-black/55">At checkout</span></div><div className="mt-2 flex justify-between border-t border-black/[.08] pt-2.5 text-[14px] font-bold"><span>Total</span><span>{money(total)}</span></div></div>}
          <Link href="/checkout" onClick={closeCart} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-[13px_13px_5px_13px] bg-black px-4 text-[9px] font-bold text-white"><span>{isPoints ? "Redeem at checkout" : "Checkout"}</span><span>↗</span></Link>
          <div className="flex items-center justify-between py-2.5 text-[8px] text-black/34"><Link href="/cart" onClick={closeCart} className="font-semibold hover:text-black">View bag</Link><Link href={isPoints ? "/payung" : "/account"} onClick={closeCart} className="font-semibold hover:text-black">{isPoints ? "Payung Program" : customer ? "Account" : "Log in"}</Link></div>
        </div>}
      </aside>
    </div>
  );
}

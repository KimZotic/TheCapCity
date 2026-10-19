"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/components/account/account-provider";
import { usePayungProgram } from "@/components/account/payung-program-provider";
import { useCart } from "@/components/commerce/cart-provider";

export function PayungRewardDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const { customer } = useAccount();
  const { state, hydrated } = usePayungProgram();
  const { addRewardItem, closeCart } = useCart();
  const reward = useMemo(() => state.rewards.find((item) => item.slug === slug && item.status === "active") ?? null, [state.rewards, slug]);
  const firstAvailable = useMemo(() => reward?.variants.find((item) => item.stock > 0) ?? reward?.variants[0], [reward]);
  const [variantId, setVariantId] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reward) return;
    const initial = reward.variants.find((item) => item.stock > 0) ?? reward.variants[0];
    setVariantId(initial?.id ?? "");
    setActiveImage(initial?.image ?? reward.image);
  }, [reward]);

  if (!hydrated) return <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]"><div className="tcc-skeleton-light aspect-square rounded-[22px]"/><div className="tcc-skeleton-light h-[460px] rounded-[22px]"/></div>;
  if (!reward) return <div className="grid min-h-[54vh] place-items-center rounded-[22px] border border-white/10 bg-[#15161a] p-8 text-center"><div><p className="font-display text-[28px]">Reward unavailable.</p><p className="mt-2 text-[9px] text-white/40">This Payung reward is no longer active.</p><button type="button" onClick={() => router.push("/payung#rewards")} className="mt-5 inline-grid min-h-11 place-items-center rounded-[12px] bg-white px-4 text-[9px] font-bold text-black">Back to rewards</button></div></div>;

  const variant = reward.variants.find((item) => item.id === variantId) ?? firstAvailable;
  const redeemed = Boolean(customer?.redeemedRewardIds.includes(reward.id));
  const eligible = Boolean(customer && customer.points >= reward.points && !redeemed && variant && variant.stock > 0);
  const gallery = [...new Set([activeImage || reward.image, ...reward.gallery, ...reward.variants.map((item) => item.image).filter(Boolean)].filter(Boolean))];

  function selectVariant(id: string) {
    const next = reward.variants.find((item) => item.id === id);
    if (!next) return;
    setVariantId(id);
    if (next.image) setActiveImage(next.image);
    setMessage("");
  }

  function add(goCheckout = false) {
    if (!customer) { setMessage("Log in to redeem Payung Program rewards."); return; }
    if (redeemed) { setMessage("This reward has already been redeemed on this account."); return; }
    if (customer.points < reward.points) { setMessage(`You need ${(reward.points - customer.points).toLocaleString()} more points.`); return; }
    if (!variant || variant.stock <= 0) { setMessage("This option is currently unavailable."); return; }
    const result = addRewardItem(reward, variant);
    setMessage(result.message);
    if (result.ok && goCheckout) { closeCart(); router.push("/checkout"); }
  }

  return <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:gap-6">
    <div className="overflow-hidden rounded-[22px_22px_8px_22px] bg-[#f1f0eb] text-black">
      <div className="relative aspect-square sm:aspect-[1.12/1]"><img src={activeImage || reward.image} alt={reward.name} className="h-full w-full object-cover"/></div>
      {gallery.length > 1 && <div className="tcc-scroll flex gap-2 overflow-x-auto border-t border-black/[.08] p-3">{gallery.map((image) => <button key={image} type="button" onClick={() => setActiveImage(image)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] border bg-white ${activeImage === image ? "border-black" : "border-black/10"}`}><img src={image} alt="" className="h-full w-full object-cover"/></button>)}</div>}
    </div>

    <aside className="rounded-[22px_22px_8px_22px] bg-[#f1f0eb] p-4 text-black min-[390px]:p-5 lg:sticky lg:top-[82px]">
      <div className="flex items-center justify-between gap-3"><p className="text-[9px] font-semibold text-black/42">Payung Reward · {reward.category}</p><span className="rounded-full bg-[#d7ff57] px-2 py-1 text-[7px] font-bold">{reward.points.toLocaleString()} pts</span></div>
      <h1 className="mt-2 font-display text-[clamp(1.6rem,7vw,2.15rem)] leading-[1] tracking-[-.045em]">{reward.name}</h1>
      <div className="mt-3 flex items-center justify-between gap-4"><p className="text-[17px] font-bold">{reward.points.toLocaleString()} pts</p>{customer && <p className="text-[8px] font-semibold text-black/38">Balance · {customer.points.toLocaleString()} pts</p>}</div>

      {reward.variants.length > 1 && <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold">{reward.variants[0]?.optionLabel ?? "Option"}</p><span className="text-[8px] font-medium text-black/40">{variant?.optionValue ?? variant?.label}</span></div><div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">{reward.variants.map((item) => <button key={item.id} type="button" disabled={item.stock <= 0} onClick={() => selectVariant(item.id)} className={`min-h-10 rounded-[12px_12px_4px_12px] border px-3 text-[8px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-28 ${item.id === variant?.id ? "border-black bg-black text-white" : "border-black/[.10] bg-[#fcfcfa] hover:border-black/28"}`}>{item.optionValue ?? item.label}</button>)}</div></div>}

      <div className="mt-5 flex items-center justify-between border-y border-black/[.08] py-3"><p className={`text-[9px] font-semibold ${variant && variant.stock > 0 ? "text-black/72" : "text-[#c9412d]"}`}>{variant && variant.stock > 0 ? variant.stock <= 3 ? `Low stock · ${variant.stock} left` : "In stock" : "Currently unavailable"}</p><p className="text-[8px] text-black/38">One reward per account</p></div>

      <div className="mt-4 grid grid-cols-[1fr_.85fr] gap-2"><button type="button" onClick={() => add(false)} disabled={Boolean(customer && !eligible)} className="min-h-[48px] rounded-[13px_13px_5px_13px] bg-black px-4 text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:bg-black/20">{redeemed ? "Redeemed" : "Add to Payung bag"}</button><button type="button" onClick={() => add(true)} disabled={Boolean(customer && !eligible)} className="min-h-[48px] rounded-[13px_13px_5px_13px] border border-black px-4 text-[9px] font-bold disabled:cursor-not-allowed disabled:opacity-30">Redeem now</button></div>
      <div aria-live="polite" className="min-h-5 pt-1.5 text-[8px] font-semibold text-[#4d58df]">{message}</div>

      <div className="mt-1 divide-y divide-black/[.07] border-y border-black/[.08]">
        <details className="group py-3"><summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-semibold"><span>Details</span><span className="text-black/35 transition group-open:rotate-45">+</span></summary><div className="mt-3 text-[8px] leading-4 text-black/50"><p>{reward.description}</p><ul className="mt-2 space-y-1.5">{reward.details.map((detail) => <li key={detail}>• {detail}</li>)}</ul></div></details>
        <details className="group py-3"><summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-semibold"><span>Delivery & pickup</span><span className="text-black/35 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-[8px] leading-4 text-black/48">Redeem with Payung Points, then choose delivery or TCC flagship pickup at checkout.</p></details>
      </div>
    </aside>
  </div>;
}

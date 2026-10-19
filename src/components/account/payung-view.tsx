"use client";

import Link from "next/link";
import { useMemo, useState, type SVGProps } from "react";
import { useAccount } from "@/components/account/account-provider";
import { usePayungProgram } from "@/components/account/payung-program-provider";
import { useCart } from "@/components/commerce/cart-provider";
import { CrownIcon, SparkIcon, UmbrellaIcon } from "@/components/icons";
import { getPayungTier, payungEarnMethods, payungFaqs, payungTierBenefits, payungTiers } from "@/lib/account/payung-data";
import type { PayungTierId } from "@/lib/account/contracts";

const PAYUNG_ART = "/brand/jangan-cakap-abang-tak-payung.jpg";
function money(value: number) { return `RM${value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date(value)); }
const baseIcon = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function InstagramIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.2"/><circle cx="17.2" cy="6.9" r=".8" fill="currentColor" stroke="none"/></svg>; }
function TikTokIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 4v9.1a4 4 0 1 1-3.2-3.9"/><path d="M14 4c.6 2.5 2.1 4 4.6 4.5"/></svg>; }
function FacebookIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}><path d="M13.8 20v-7h2.4l.4-3h-2.8V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.6-.1-1.3-.2-2.2-.2-2.3 0-3.9 1.4-3.9 4V10H8.3v3h2.6v7"/></svg>; }
function EarnIcon({ type, ...props }: { type: string } & SVGProps<SVGSVGElement>) {
  if (type === "instagram") return <InstagramIcon {...props}/>;
  if (type === "tiktok") return <TikTokIcon {...props}/>;
  if (type === "facebook") return <FacebookIcon {...props}/>;
  if (type === "money") return <svg {...baseIcon} {...props}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9h.01M18 15h.01"/></svg>;
  if (type === "member") return <svg {...baseIcon} {...props}><path d="M5 8h14v11H5zM8 8V5h8v3"/><path d="M9 13h6"/></svg>;
  if (type === "birthday") return <svg {...baseIcon} {...props}><path d="M4 11h16v9H4zM6 11V8h12v3M8 8c0-2 2-2 2-4M16 8c0-2-2-2-2-4"/><path d="M4 15c2 1.4 4 1.4 6 0 2 1.4 4 1.4 6 0 1.3.9 2.6 1.2 4 .6"/></svg>;
  if (type === "mail") return <svg {...baseIcon} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
  return <SparkIcon {...props}/>;
}
function TierIcon({ id, className = "h-6 w-6" }: { id: PayungTierId; className?: string }) {
  if (id === "crown") return <CrownIcon className={className}/>;
  if (id === "gold-cup") return <SparkIcon className={className}/>;
  return <UmbrellaIcon className={className}/>;
}
function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return <div className="border-b border-black/10"><button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-4 text-left"><span className="text-[11px] font-semibold sm:text-[12px]">{question}</span><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 text-[14px] transition-transform ${open ? "rotate-45 bg-black text-white" : ""}`}>+</span></button>{open && <p className="max-w-3xl pb-5 pr-10 text-[9px] leading-5 text-black/52">{answer}</p>}</div>;
}

export function PayungView() {
  const { customer, activities, hydrated } = useAccount();
  const { state: payungState, hydrated: payungHydrated } = usePayungProgram();
  const { addRewardItem } = useCart();
  const [message, setMessage] = useState("");
  const rewards = useMemo(() => payungState.rewards.filter((reward) => reward.status === "active"), [payungState.rewards]);
  const earnMethods = useMemo(() => payungEarnMethods.map((method) => method.id === "purchase" ? { ...method, value: `${payungState.settings.pointsPerRM} points per RM1` } : method.id === "join" ? { ...method, value: `${payungState.settings.joinBonus} points` } : method), [payungState.settings]);
  const tier = useMemo(() => customer ? getPayungTier(customer.lifetimeSpend) : null, [customer]);
  const tierIndex = tier ? payungTiers.findIndex((item) => item.id === tier.id) : 0;
  const progress = customer && tier?.nextSpend ? Math.min(100, Math.max(0, ((customer.lifetimeSpend - tier.minSpend) / (tier.nextSpend - tier.minSpend)) * 100)) : 100;

  if (!hydrated || !payungHydrated) return <section className="min-h-[60vh] bg-[#0b0b0d] px-4 py-10"><div className="mx-auto max-w-[1180px] space-y-3"><div className="tcc-skeleton-light h-72 rounded-[24px]"/><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[0,1,2,3].map((item)=><div key={item} className="tcc-skeleton-light h-40 rounded-[20px]"/>)}</div></div></section>;

  function quickAdd(rewardId: string) {
    const reward = rewards.find((item) => item.id === rewardId);
    if (!reward) return;
    if (!customer) { setMessage("Log in to redeem Payung Program rewards."); return; }
    if (customer.redeemedRewardIds.includes(reward.id)) { setMessage("This reward has already been redeemed on this account."); return; }
    if (customer.points < reward.points) { setMessage(`You need ${(reward.points - customer.points).toLocaleString()} more points for ${reward.name}.`); return; }
    if (reward.variants.length > 1) { setMessage("Select an option from the reward detail page."); return; }
    setMessage(addRewardItem(reward, reward.variants[0]).message);
  }

  return <section className="bg-[#0b0b0d] text-white">
    <section className="px-3 pt-4 min-[390px]:px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px_28px_10px_28px] border border-white/10 bg-black">
        <div className="relative min-h-[250px] sm:min-h-[360px] lg:min-h-[430px]"><img src={PAYUNG_ART} alt="Jangan Cakap Abang Tak Payung" className="absolute inset-0 h-full w-full object-contain px-4 py-8 sm:px-10 lg:px-16"/><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(215,255,87,.07),transparent_28%)]"/>{customer ? <a href="#rewards" className="absolute bottom-4 right-4 inline-flex min-h-10 items-center rounded-full bg-white px-4 text-[8px] font-bold text-black shadow-[0_10px_28px_rgba(0,0,0,.28)] sm:bottom-5 sm:right-5">Browse rewards ↓</a> : <Link href="/account" className="absolute bottom-4 right-4 inline-flex min-h-10 items-center rounded-full bg-white px-4 text-[8px] font-bold text-black shadow-[0_10px_28px_rgba(0,0,0,.28)] sm:bottom-5 sm:right-5">Join Payung Program ↗</Link>}</div>
      </div>
    </section>

    {customer && tier && (
      <section className="px-3 py-5 min-[390px]:px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] items-start gap-3 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[14px_14px_5px_14px] bg-[#d7ff57] text-black"><TierIcon id={tier.id} className="h-5 w-5"/></div>
              <div>
                <p className="text-[8px] font-bold text-white/40">{tier.name}</p>
                <div className="mt-1 flex items-baseline gap-2"><p className="text-[30px] font-bold leading-none tracking-[-.05em]">{customer.points.toLocaleString()}</p><span className="text-[8px] text-white/36">pts</span></div>
              </div>
              <Link href="/account" className="ml-auto text-[8px] font-bold text-white/46">Account ↗</Link>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-[7px] font-semibold text-white/32"><span>{money(customer.lifetimeSpend)} lifetime</span>{tier.nextSpend && <span>{money(tier.nextSpend)} next tier</span>}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-[#d7ff57] transition-[width] duration-500" style={{width:`${progress}%`}}/></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[8px]">
              <div className="rounded-[12px] bg-white/[.04] p-3"><span className="text-white/35">Tier</span><p className="mt-1 font-bold">{tier.name}</p></div>
              <div className="rounded-[12px] bg-white/[.04] p-3"><span className="text-white/35">Points</span><p className="mt-1 font-bold">{customer.points.toLocaleString()}</p></div>
            </div>
          </div>
          <div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-5">
            <div className="flex items-center justify-between"><p className="text-[9px] font-bold">Recent points</p><SparkIcon className="h-4 w-4 text-[#d7ff57]"/></div>
            <div className="mt-2 grid gap-0 sm:grid-cols-2">
              {activities.slice(0,4).map((activity)=><div key={activity.id} className="flex items-center justify-between border-b border-white/8 py-2.5 sm:odd:pr-4 sm:even:border-l sm:even:pl-4"><div><p className="text-[8px] font-semibold">{activity.label}</p><p className="mt-1 text-[7px] text-white/25">{formatDate(activity.at)}</p></div><span className={`text-[9px] font-bold ${activity.points>=0?"text-[#d7ff57]":"text-white/54"}`}>{activity.points>0?"+":""}{activity.points.toLocaleString()}</span></div>)}
            </div>
          </div>
        </div>
      </section>
    )}

    <section id="rewards" className="bg-[#ecebe5] px-3 py-12 text-black min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[1180px]"><div className="text-center"><h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] tracking-[-.05em]">Jangan Cakap Abang Tak Payung</h2>{customer && <p className="mt-3 text-[9px] font-bold text-black/42">{customer.points.toLocaleString()} pts available</p>}</div><div className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">{rewards.map((reward)=>{const redeemed=Boolean(customer?.redeemedRewardIds.includes(reward.id));const eligible=Boolean(customer&&customer.points>=reward.points&&!redeemed);const hasOptions=reward.variants.length>1;return <article key={reward.id} className="group flex h-full flex-col overflow-hidden rounded-[20px_20px_7px_20px] border border-black/8 bg-white shadow-[0_8px_26px_rgba(0,0,0,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(0,0,0,.1)]"><Link href={`/payung/rewards/${reward.slug}`} className="relative aspect-square overflow-hidden bg-[#f8f8f5]"><img src={reward.image} alt={reward.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/><span className="absolute left-3 top-3 rounded-full bg-black px-2 py-1 text-[7px] font-bold text-white">{reward.points.toLocaleString()} pts</span></Link><div className="flex flex-1 flex-col p-3.5"><p className="text-[7px] font-bold uppercase tracking-[.12em] text-black/35">{reward.category}</p><Link href={`/payung/rewards/${reward.slug}`} className="mt-1.5 min-h-9 text-[11px] font-bold leading-4 hover:underline">{reward.name}</Link><div className="mt-auto pt-4">{redeemed ? <button type="button" disabled className="w-full min-h-10 rounded-[11px] bg-[#f1f0eb] px-3 text-[8px] font-bold text-black/38">Redeemed</button> : !customer ? <Link href={`/payung/rewards/${reward.slug}`} className="grid min-h-10 place-items-center rounded-[11px] bg-black px-3 text-[8px] font-bold text-white">View reward</Link> : hasOptions ? <Link href={`/payung/rewards/${reward.slug}`} className="grid min-h-10 place-items-center rounded-[11px] bg-black px-3 text-[8px] font-bold text-white">Select options</Link> : eligible ? <button type="button" onClick={()=>quickAdd(reward.id)} className="w-full min-h-10 rounded-[11px] bg-black px-3 text-[8px] font-bold text-white">Add reward</button> : <Link href={`/payung/rewards/${reward.slug}`} className="grid min-h-10 place-items-center rounded-[11px] bg-[#f1f0eb] px-3 text-[8px] font-bold text-black/46">View reward</Link>}</div></div></article>})}</div>{message&&<p role="status" className="mt-5 text-center text-[8px] font-semibold text-black/50">{message}</p>}</div></section>

    <section className="bg-white px-3 py-12 text-black min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[1180px]"><h2 className="text-center font-display text-[1.9rem] tracking-[-.04em]">Earn points</h2><div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{earnMethods.map((method)=><div key={method.id} className="group min-h-[146px] rounded-[18px_18px_6px_18px] border border-black/10 bg-[#f8f7f3] p-4 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_14px_34px_rgba(0,0,0,.07)]"><div className="grid h-9 w-9 place-items-center rounded-[11px_11px_4px_11px] bg-black text-white"><EarnIcon type={method.icon} className="h-[18px] w-[18px]"/></div><p className="mt-5 text-[12px] font-bold">{method.value}</p><p className="mt-2 text-[9px] text-black/48">{method.label}</p></div>)}</div></div></section>

    <section className="bg-[#f4f3ee] px-3 py-12 text-black min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[1180px]"><h2 className="font-display text-[1.9rem] tracking-[-.04em]">Member tiers</h2><div className="mt-6 grid gap-2 sm:grid-cols-2 lg:hidden">{payungTiers.map((item,index)=>{const active=Boolean(customer&&index===tierIndex);const benefitRows=payungTierBenefits.map((row)=>({label:row.label,value:row.values[index]}));return <article key={item.id} className={`overflow-hidden rounded-[20px_20px_7px_20px] border ${active?"border-black bg-black text-white":"border-black/10 bg-white"}`}><div className={`flex items-center gap-3 p-4 ${active?"bg-[#d7ff57] text-black":""}`}><div className={`grid h-11 w-11 place-items-center rounded-[14px_14px_5px_14px] ${active?"bg-black text-white":"bg-black/[.055]"}`}><TierIcon id={item.id} className="h-5 w-5"/></div><div><p className="text-[13px] font-bold">{item.name}</p><p className="mt-1 text-[8px] opacity-50">{money(item.minSpend)}{item.nextSpend ? ` – ${money(item.nextSpend-1)}` : " & above"}</p></div></div><div className={`divide-y px-4 py-1 ${active?"divide-white/10":"divide-black/8"}`}>{benefitRows.map((row)=><div key={row.label} className="grid grid-cols-[1fr_auto] gap-3 py-3 text-[8px]"><span className={active?"text-white/50":"text-black/45"}>{row.label}</span><span className="font-bold">{typeof row.value === "boolean" ? row.value ? "✓" : "—" : row.value}</span></div>)}</div></article>})}</div><div className="tcc-scroll mt-7 hidden overflow-x-auto lg:block"><div className="min-w-[760px] overflow-hidden rounded-[20px_20px_7px_20px] border border-black/10 bg-white"><div className="grid grid-cols-[210px_repeat(4,1fr)] border-b border-black/10 bg-black text-white"><div className="p-4 text-[8px] font-bold text-white/45">BENEFIT</div>{payungTiers.map((item,index)=><div key={item.id} className={`p-4 ${customer&&index===tierIndex?"bg-[#d7ff57] text-black":""}`}><div className="flex items-center gap-2"><TierIcon id={item.id} className="h-4 w-4"/><p className="text-[10px] font-bold">{item.name}</p></div><p className="mt-1 text-[7px] opacity-50">{money(item.minSpend)}+</p></div>)}</div>{payungTierBenefits.map((row)=><div key={row.label} className="grid grid-cols-[210px_repeat(4,1fr)] border-b border-black/8 last:border-0"><div className="p-4 text-[9px] font-semibold">{row.label}</div>{row.values.map((value,index)=><div key={index} className="grid min-h-[58px] place-items-center border-l border-black/6 p-3 text-center text-[9px]">{typeof value === "boolean" ? value ? <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[9px] text-white">✓</span> : <span className="text-black/15">—</span> : <span className="font-semibold">{value}</span>}</div>)}</div>)}</div></div></div></section>

    <section className="bg-white px-3 py-12 text-black min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[980px]"><h2 className="font-display text-center text-[1.9rem] tracking-[-.04em]">FAQs</h2><div className="mt-7 border-t border-black/10">{payungFaqs.map(([question,answer])=><FaqRow key={question} question={question} answer={answer}/>)}</div></div></section>
  </section>;
}

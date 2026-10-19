"use client";

import Link from "next/link";
import { ArrowIcon, ChatIcon } from "@/components/icons";
import type { SupportTopic } from "@/lib/support/contracts";

const rows: { label: string; detail: string; topic?: SupportTopic; href?: string }[] = [
  { label: "Track an order", detail: "Use your order reference with the email or phone from checkout.", href: "/tracking" },
  { label: "Product & sizing", detail: "Check fit, size, colour or stock before you buy.", topic: "product" },
  { label: "Delivery & pickup", detail: "Help with delivery options or TCC store pickup.", topic: "pickup" },
  { label: "Payung Program", detail: "Points, tiers, rewards and member account help.", href: "/payung" }
];

const faqs = [
  ["Can I buy without an account?", "Yes. Guest checkout remains available. An account is only needed for the full Payung member experience."],
  ["Where can I collect a pickup order?", "The demo pickup flow uses TCC Flagship Store / Main HQ in SS15, Subang Jaya."],
  ["Can support see my orders?", "This frontend demo stores orders in your browser. Use Tracking or your signed-in demo account to access saved orders."],
  ["Is this real live chat?", "Not yet. Conversation behavior is simulated for the frontend demo and will be replaced by the approved production support provider later."]
];

function openSupport(topic: SupportTopic = "general") {
  window.dispatchEvent(new CustomEvent("tcc:open-support", { detail: { topic } }));
}

export function SupportPageView() {
  return (
    <section className="bg-[#0b0b0d] px-3 py-6 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid overflow-hidden rounded-[24px_24px_8px_24px] border border-white/10 bg-[#111216] lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
            <img src="https://thecapcity.com/cdn/shop/files/SnapInsta.to_528402220_18525292090034253_3862574897883795951_n.jpg?v=1754539474&width=1800" alt="The Cap City support" className="absolute inset-0 h-full w-full object-cover opacity-72"/>
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,4,5,.86),rgba(4,4,5,.08)_70%)]"/>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <h1 className="font-display text-[clamp(2rem,7vw,3.8rem)] leading-[.95] tracking-[-.05em]">Support.</h1>
              <p className="mt-3 max-w-sm text-[10px] leading-5 text-white/58">Fast paths for orders, products, pickup and Payung Program.</p>
              <button type="button" onClick={() => openSupport()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[13px_13px_4px_13px] bg-white px-4 text-[9px] font-bold text-black"><ChatIcon className="h-4 w-4"/> Start chat</button>
            </div>
          </div>

          <div className="flex flex-col bg-[#f1f0eb] text-black">
            <div className="divide-y divide-black/8">
              {rows.map((row) => {
                const content = <><div><p className="text-[11px] font-bold">{row.label}</p><p className="mt-1 max-w-sm text-[8px] leading-4 text-black/45">{row.detail}</p></div><ArrowIcon className="h-4 w-4 shrink-0 text-black/32"/></>;
                if (row.href) return <Link key={row.label} href={row.href} className="flex min-h-[94px] items-center justify-between gap-4 px-4 py-4 transition hover:bg-white/60 sm:px-5">{content}</Link>;
                return <button key={row.label} type="button" onClick={() => openSupport(row.topic)} className="flex min-h-[94px] w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/60 sm:px-5">{content}</button>;
              })}
            </div>
            <div className="mt-auto border-t border-black/8 px-4 py-4 text-[7px] leading-4 text-black/38 sm:px-5">Demo support state is saved locally in this browser. Production chat, email and notification providers remain intentionally uncommitted until client approval.</div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-8">
          <div><h2 className="text-[18px] font-semibold tracking-[-.03em]">Common questions</h2><p className="mt-2 text-[8px] leading-4 text-white/34">Only the useful stuff.</p></div>
          <div className="border-t border-white/10">
            {faqs.map(([question, answer]) => <details key={question} className="group border-b border-white/10"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[10px] font-semibold"><span>{question}</span><span className="text-white/30 transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-4 pr-8 text-[8px] leading-4 text-white/42">{answer}</p></details>)}
          </div>
        </div>
      </div>
    </section>
  );
}

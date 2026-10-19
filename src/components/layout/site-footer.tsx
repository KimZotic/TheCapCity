import Image from "next/image";
import Link from "next/link";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";

function PoweredBadge() {
  return <div className="tcc-powered-badge group inline-flex w-max max-w-full shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.04))] px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_10px_30px_rgba(0,0,0,.18)] transition hover:border-white/24 hover:bg-white/[.08]"><span className="h-1.5 w-1.5 rounded-full bg-[#d7ff57] shadow-[0_0_16px_rgba(215,255,87,.65)]"/><span className="text-[8px] font-semibold text-white/42">Powered by</span><span className="text-[9px] font-bold tracking-[-.01em] text-white">SteadyGroup</span></div>;
}

export function SiteFooter() {
  return (
    <footer className="bg-[#09090a] text-white">
      <div className="mx-auto max-w-[1380px] px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.2fr_.9fr_.8fr]">
          <div><div className="relative h-[38px] w-[65px]"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill className="object-contain object-left" sizes="65px"/></div><p className="mt-4 max-w-sm text-[14px] font-semibold leading-6 tracking-[-.02em] text-white/76">A brand for <span className="text-white">the people</span>, by <span className="text-white">the people</span>.</p><p className="mt-2 max-w-sm text-[9px] leading-4 text-white/34">Headwear, apparel, collaborations and releases from The Cap City.</p></div>
          <div className="grid grid-cols-2 gap-6 text-[11px] font-semibold text-white/58"><div className="space-y-3"><Link className="block hover:text-white" href="/shop">Shop</Link><Link className="block hover:text-white" href="/collections">Collections</Link><Link className="block hover:text-white" href="/drops">Drops</Link><Link className="block hover:text-white" href="/payung">Payung Program</Link></div><div className="space-y-3"><Link className="block hover:text-white" href="/account">Account</Link><Link className="block hover:text-white" href="/story">Story</Link><Link className="block hover:text-white" href="/support">Support</Link><Link className="block hover:text-white" href="/tracking">Tracking</Link></div></div>
          <FooterNewsletter />
        </div>
        <div className="flex flex-col items-start gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-[8px] font-semibold text-white/25">© THE CAP CITY</span><PoweredBadge/></div>
      </div>
    </footer>
  );
}

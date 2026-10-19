import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#09090a] text-white">
      <AnnouncementBar />
      <SiteHeader />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid min-h-[52vh] max-w-[900px] place-items-center text-center">
          <div>
            <span className="inline-grid h-11 min-w-11 place-items-center rounded-[13px_13px_4px_13px] border border-white/12 bg-white/[.04] px-3 text-[9px] font-bold text-white/46">404</span>
            <h1 className="font-display mt-5 text-[clamp(2rem,8vw,4rem)] leading-[.96] tracking-[-.055em]">That page left the rotation.</h1>
            <p className="mx-auto mt-4 max-w-[44ch] text-[11px] leading-5 text-white/42">The link may have moved, expired, or never belonged to this storefront.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2"><Link href="/shop" className="tcc-button tcc-button-inverse">Shop TCC ↗</Link><Link href="/" className="inline-flex min-h-11 items-center rounded-[14px_14px_5px_14px] border border-white/14 px-4 text-[10px] font-semibold text-white/72 hover:bg-white/[.06] hover:text-white">Back home</Link></div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

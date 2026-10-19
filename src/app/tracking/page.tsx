import { Suspense } from "react";
import { TrackingView } from "@/components/checkout/tracking-view";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function TrackingPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <Suspense fallback={<section className="min-h-[58vh] bg-[#0b0b0d] px-4 py-12 text-white"><div className="mx-auto max-w-[1180px] text-[10px] font-semibold text-white/40">Loading tracking…</div></section>}>
        <TrackingView />
      </Suspense>
      <SiteFooter />
    </main>
  );
}

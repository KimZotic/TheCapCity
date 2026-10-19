import { CheckoutView } from "@/components/checkout/checkout-view";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function CheckoutPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <CheckoutView />
      <SiteFooter />
    </main>
  );
}

import { OrderSuccessView } from "@/components/checkout/order-success-view";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function OrderSuccessPage() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <OrderSuccessView />
      <SiteFooter />
    </main>
  );
}

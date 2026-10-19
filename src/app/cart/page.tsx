import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartPageView } from "@/components/commerce/cart-page-view";

export default function CartPage() {
  return <main><AnnouncementBar /><SiteHeader/><CartPageView/><SiteFooter/></main>;
}

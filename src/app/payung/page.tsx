import { PayungView } from "@/components/account/payung-view";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PayungPage() {
  return <main><AnnouncementBar /><SiteHeader/><PayungView/><SiteFooter/></main>;
}

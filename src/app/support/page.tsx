import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SupportPageView } from "@/components/support/support-page-view";

export default function SupportPage() {
  return <main><AnnouncementBar /><SiteHeader/><SupportPageView/><SiteFooter/></main>;
}

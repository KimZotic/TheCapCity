import { AccountView } from "@/components/account/account-view";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AccountPage() {
  return <main><AnnouncementBar /><SiteHeader/><AccountView/><SiteFooter/></main>;
}

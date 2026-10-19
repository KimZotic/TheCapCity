import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LiveDropDetail } from "@/components/storefront/live-drop-detail";
export default async function DropPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <main className="bg-[#0b0b0d] text-white"><AnnouncementBar/><SiteHeader/><LiveDropDetail slug={slug}/><SiteFooter/></main>;}

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CollectionDetailExperience } from "@/components/storefront/collection-detail-experience";
import { getCollection, getCollections } from "@/lib/services/commerce-service";

export async function generateStaticParams() { return (await getCollections()).map((collection) => ({ slug: collection.slug })); }

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  return <main className="bg-[#0b0b0d] text-white"><AnnouncementBar /><SiteHeader/><CollectionDetailExperience slug={slug} initialCollection={collection}/><SiteFooter/></main>;
}

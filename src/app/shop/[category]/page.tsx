import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CatalogView } from "@/components/storefront/catalog-view";
import { getCatalog } from "@/lib/services/commerce-service";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const catalog = await getCatalog(category);
  return <main><AnnouncementBar /><SiteHeader/><CatalogView catalog={catalog} category={category}/><SiteFooter/></main>;
}

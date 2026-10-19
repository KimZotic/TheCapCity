import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroCampaign } from "@/components/storefront/hero-campaign";
import { HomeSections } from "@/components/storefront/home-sections";
import { getHomePageData } from "@/lib/services/commerce-service";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <HeroCampaign campaign={data.hero} />
      <HomeSections latest={data.latestDrop} categories={data.categories} tiles={data.editorialTiles} editorial={data.editorial} />
      <SiteFooter />
    </main>
  );
}

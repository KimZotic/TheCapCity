import { notFound } from "next/navigation";
import { studioModuleMap } from "@/components/studio/studio-module-view";
import { StudioPromotionsView } from "@/components/studio/studio-promotions-view";
import { StudioDropsView } from "@/components/studio/studio-drops-view";
import { StudioContentView } from "@/components/studio/studio-content-view";
import { StudioReportsView } from "@/components/studio/studio-reports-view";
import { StudioSupportView } from "@/components/studio/studio-support-view";
import { StudioSettingsView } from "@/components/studio/studio-settings-view";

export default async function StudioModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (!(module in studioModuleMap)) notFound();
  if (module === "promotions") return <StudioPromotionsView/>;
  if (module === "drops") return <StudioDropsView/>;
  if (module === "content") return <StudioContentView/>;
  if (module === "reports") return <StudioReportsView/>;
  if (module === "support") return <StudioSupportView/>;
  if (module === "settings") return <StudioSettingsView/>;
  notFound();
}

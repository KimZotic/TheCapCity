import type { DemoOrder } from "@/lib/commerce/contracts";

export interface StudioAnnouncementSettings {
  enabled: boolean;
  message: string;
  href: string;
  startsAt?: string;
  endsAt?: string;
}

export interface StudioSettings {
  announcement: StudioAnnouncementSettings;
}

export interface StudioOverviewMetrics {
  grossSales: number;
  orderCount: number;
  aov: number;
  conversion: number;
  lowStockVariants: number;
  soldOutProducts: number;
  activeProducts: number;
}

export interface StudioSnapshot {
  settings: StudioSettings;
  orders: DemoOrder[];
  metrics: StudioOverviewMetrics;
}

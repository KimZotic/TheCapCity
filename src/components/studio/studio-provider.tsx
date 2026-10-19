"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DemoOrder } from "@/lib/commerce/contracts";
import { useCatalog } from "@/components/commerce/catalog-provider";
import type { StudioCatalogState } from "@/lib/studio/catalog-storage";
import { listDemoOrders } from "@/lib/services/demo-order-service";
import type { StudioOverviewMetrics, StudioSettings } from "@/lib/studio/contracts";
import { DEFAULT_STUDIO_SETTINGS, readStudioSettings, writeStudioSettings } from "@/lib/studio/studio-storage";

interface StudioContextValue {
  hydrated: boolean;
  settings: StudioSettings;
  orders: DemoOrder[];
  metrics: StudioOverviewMetrics;
  refreshOrders: () => void;
  updateAnnouncement: (announcement: StudioSettings["announcement"]) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);
const BASELINE_SALES = 3240;
const BASELINE_ORDERS = 18;

function makeMetrics(orders: DemoOrder[], catalog: StudioCatalogState): StudioOverviewMetrics {
  const moneyOrders = orders.filter((order) => order.paymentMethod !== "payung-points");
  const liveSales = moneyOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = BASELINE_ORDERS + moneyOrders.length;
  const grossSales = BASELINE_SALES + liveSales;
  const liveRecords = catalog.products.filter((record)=>!record.archived);
  const lowStockVariants = liveRecords.flatMap((record) => record.product.variants.map((variant) => ({ variant, threshold: record.lowStockThreshold }))).filter(({variant,threshold}) => variant.stock > 0 && variant.stock <= threshold).length;
  const soldOutProducts = liveRecords.filter((record) => record.published && record.product.totalStock <= 0).length;
  return {
    grossSales,
    orderCount,
    aov: orderCount ? grossSales / orderCount : 0,
    conversion: 3.6,
    lowStockVariants,
    soldOutProducts,
    activeProducts: liveRecords.filter((record) => record.published).length,
  };
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const { state: catalog } = useCatalog();
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  const refreshOrders = useCallback(() => setOrders(listDemoOrders()), []);

  useEffect(() => {
    setSettings(readStudioSettings());
    refreshOrders();
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "tcc-demo-orders-v1") refreshOrders();
      if (event.key === "tcc-demo-studio-v1") setSettings(readStudioSettings());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshOrders]);

  const updateAnnouncement = useCallback((announcement: StudioSettings["announcement"]) => {
    const next = { ...settings, announcement };
    setSettings(next);
    writeStudioSettings(next);
  }, [settings]);

  const metrics = useMemo(() => makeMetrics(orders, catalog), [orders, catalog]);
  const value = useMemo<StudioContextValue>(() => ({ hydrated, settings, orders, metrics, refreshOrders, updateAnnouncement }), [hydrated, settings, orders, metrics, refreshOrders, updateAnnouncement]);
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio must be used inside StudioProvider");
  return context;
}

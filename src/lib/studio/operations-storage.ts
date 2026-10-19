import { demoDrops, demoHomePageData } from "@/lib/demo/data";
import type { DropStatus, EditorialTile } from "@/lib/commerce/contracts";

export type PromotionKind = "percent" | "fixed";

export interface StudioPromotion {
  id: string;
  name: string;
  code: string;
  kind: PromotionKind;
  value: number;
  minSpend: number;
  eligibleProductSlugs: string[];
  eligibleCollectionSlugs: string[];
  usageLimit: number;
  uses: number;
  enabled: boolean;
  startsAt: string;
  endsAt: string;
}


export interface StudioGiftCard {
  id: string;
  code: string;
  balance: number;
  originalBalance: number;
  enabled: boolean;
  note: string;
}

export interface StudioDropRecord {
  id: string;
  kind: "drop" | "event";
  venue: string;
  slug: string;
  title: string;
  kicker: string;
  description: string;
  status: DropStatus;
  releaseAt: string;
  collectionSlug?: string;
  productSlugs: string[];
  tone: "ink" | "paper" | "olive" | "blue" | "signal";
  image?: string;
  published: boolean;
  archived?: boolean;
}

export interface StudioHeroSlide {
  id: string;
  title: string;
  label: string;
  href: string;
  image: string;
  detail: string;
}

export type HomeSectionId = "latest" | "categories" | "editorial-wall" | "editorial-feature" | "payung";
export interface StudioHomeSection { id: HomeSectionId; visible: boolean; startsAt: string; endsAt: string; }

export interface StudioHomeContent {
  heroSlides: StudioHeroSlide[];
  latestDropSlugs: string[];
  sections: StudioHomeSection[];
  editorialTiles: EditorialTile[];
  editorialTitle: string;
  editorialCopy: string;
  editorialCta: string;
  editorialHref: string;
  editorialImage: string;
}

export interface StudioShippingZone {
  id: string;
  label: string;
  countries: string[];
  states?: string[];
  rate: number;
  enabled: boolean;
}

export interface StudioOperationsSettings {
  pickupEnabled: boolean;
  pickupName: string;
  pickupAddress: string;
  supportEmail: string;
  orderPrefix: string;
  paymentMethods: { gateway: boolean; onlineBanking: boolean; ewallet: boolean };
  shippingZones: StudioShippingZone[];
}

export interface StudioOperationsState {
  promotions: StudioPromotion[];
  giftCards: StudioGiftCard[];
  drops: StudioDropRecord[];
  content: StudioHomeContent;
  settings: StudioOperationsSettings;
}

export const OPERATIONS_STORAGE_KEY = "tcc-demo-operations-v1";
export const OPERATIONS_EVENT = "tcc:operations-state";

const heroSlides: StudioHeroSlide[] = [
  {
    id: "hero-kl",
    title: "KL Legacy",
    label: "HEADWEAR / KUALA LUMPUR",
    href: "/collections/kl-legacy",
    image: "https://thecapcity.com/cdn/shop/files/144P_anner_desk.jpg?v=1774858602&width=1800",
    detail: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-06_e0194f97-7150-4148-a008-696fa928d11e.jpg?v=1788444569&width=900"
  },
  {
    id: "hero-city",
    title: "The Cap City",
    label: "CITY CULTURE / NEW ROTATION",
    href: "/shop",
    image: "https://thecapcity.com/cdn/shop/files/Snapinst.app_474886423_18488021281034253_3262692847795330647_n_1080.jpg?v=1737967597&width=1600",
    detail: "https://thecapcity.com/cdn/shop/files/KL_Legacy_Cover_Sizing.jpg?v=1759810800&width=900"
  },
  {
    id: "hero-hikari",
    title: "Hikari Havoc",
    label: "COLLABORATION / ARCHIVE",
    href: "/collections",
    image: "https://thecapcity.com/cdn/shop/files/TCCxHikariHavoc-04.jpg?v=1739371716&width=1800",
    detail: "https://thecapcity.com/cdn/shop/files/TCCxHikariHavoc-04.jpg?v=1739371716&width=900"
  }
];

export const DEFAULT_OPERATIONS_STATE: StudioOperationsState = {
  promotions: [
    { id: "promo-demo10", name: "Demo 10%", code: "DEMO10", kind: "percent", value: 10, minSpend: 0, eligibleProductSlugs: [], eligibleCollectionSlugs: [], usageLimit: 0, uses: 0, enabled: true, startsAt: "", endsAt: "" }
  ],
  giftCards: [
    { id: "gift-demo50", code: "TCCGIFT50", balance: 50, originalBalance: 50, enabled: true, note: "Demo stored-value gift card" }
  ],
  drops: demoDrops.map((drop) => ({ ...drop, kind: "drop" as const, venue: "", published: true })),
  content: {
    heroSlides,
    latestDropSlugs: demoHomePageData.latestDrop.map((product) => product.slug),
    sections: [
      { id: "latest", visible: true, startsAt: "", endsAt: "" },
      { id: "categories", visible: true, startsAt: "", endsAt: "" },
      { id: "editorial-wall", visible: true, startsAt: "", endsAt: "" },
      { id: "editorial-feature", visible: true, startsAt: "", endsAt: "" },
      { id: "payung", visible: true, startsAt: "", endsAt: "" },
    ],
    editorialTiles: structuredClone(demoHomePageData.editorialTiles),
    editorialTitle: demoHomePageData.editorial.title,
    editorialCopy: demoHomePageData.editorial.copy,
    editorialCta: demoHomePageData.editorial.cta,
    editorialHref: demoHomePageData.editorial.href,
    editorialImage: demoHomePageData.editorial.image ?? ""
  },
  settings: {
    pickupEnabled: true,
    pickupName: "TCC Flagship Store · Main HQ",
    pickupAddress: "75G, Jalan SS 15/8a, SS15, 47500 Subang Jaya, Selangor, Malaysia",
    supportEmail: "support@thecapcity.com",
    orderPrefix: "TCC",
    paymentMethods: { gateway: true, onlineBanking: true, ewallet: true },
    shippingZones: [
      { id: "zone-my-west", label: "Peninsular Malaysia", countries: ["Malaysia"], states: [], rate: 20, enabled: true },
      { id: "zone-my-east", label: "East Malaysia", countries: ["Malaysia"], states: ["Sabah","Sarawak","Labuan","W.P. Labuan","Wilayah Persekutuan Labuan"], rate: 35, enabled: true },
      { id: "zone-nearby", label: "Singapore & Brunei", countries: ["Singapore","Brunei"], rate: 45, enabled: true },
      { id: "zone-sea", label: "Indonesia & Thailand", countries: ["Indonesia","Thailand"], rate: 65, enabled: true },
      { id: "zone-au", label: "Australia", countries: ["Australia"], rate: 85, enabled: true },
      { id: "zone-west", label: "United Kingdom & United States", countries: ["United Kingdom","United States"], rate: 110, enabled: true },
      { id: "zone-intl", label: "International", countries: ["International"], rate: 120, enabled: true }
    ]
  }
};


function normalizeUniqueIds<T extends { id: string }>(items: T[], prefix: string): T[] {
  const seen = new Set<string>();
  return items.map((item, index) => {
    let id = (item.id || `${prefix}-${index + 1}`).trim();
    if (!id) id = `${prefix}-${index + 1}`;
    if (seen.has(id)) {
      let suffix = 2;
      let candidate = `${id}-${suffix}`;
      while (seen.has(candidate)) candidate = `${id}-${++suffix}`;
      id = candidate;
    }
    seen.add(id);
    return id === item.id ? item : { ...item, id };
  });
}

function browserStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }

function mergeState(parsed?: Partial<StudioOperationsState>): StudioOperationsState {
  const defaults = structuredClone(DEFAULT_OPERATIONS_STATE);
  return {
    promotions: Array.isArray(parsed?.promotions) ? normalizeUniqueIds(parsed!.promotions!.map((item) => ({ ...item, eligibleProductSlugs: Array.isArray(item.eligibleProductSlugs) ? item.eligibleProductSlugs : [], eligibleCollectionSlugs: Array.isArray(item.eligibleCollectionSlugs) ? item.eligibleCollectionSlugs : [], usageLimit: Number.isFinite(item.usageLimit) ? item.usageLimit : 0, uses: Number.isFinite(item.uses) ? item.uses : 0 })), "promo") : defaults.promotions,
    giftCards: Array.isArray(parsed?.giftCards) ? normalizeUniqueIds(parsed!.giftCards!.map((item) => ({ ...item, balance: Math.max(0, Number(item.balance) || 0), originalBalance: Math.max(Number(item.originalBalance) || 0, Number(item.balance) || 0), enabled: item.enabled !== false, note: item.note ?? "" })), "gift") : defaults.giftCards,
    drops: Array.isArray(parsed?.drops) ? parsed!.drops!.map((item) => ({ ...item, kind: item.kind === "event" ? "event" : "drop", venue: item.venue ?? "" })) : defaults.drops,
    content: {
      ...defaults.content,
      ...(parsed?.content ?? {}),
      heroSlides: Array.isArray(parsed?.content?.heroSlides) ? parsed!.content!.heroSlides : defaults.content.heroSlides,
      latestDropSlugs: Array.isArray(parsed?.content?.latestDropSlugs) ? parsed!.content!.latestDropSlugs : defaults.content.latestDropSlugs,
      sections: Array.isArray(parsed?.content?.sections) ? parsed!.content!.sections : defaults.content.sections,
      editorialTiles: Array.isArray(parsed?.content?.editorialTiles) ? parsed!.content!.editorialTiles : defaults.content.editorialTiles,
    },
    settings: {
      ...defaults.settings,
      ...(parsed?.settings ?? {}),
      paymentMethods: (() => { const methods = { ...defaults.settings.paymentMethods, ...(parsed?.settings?.paymentMethods ?? {}) }; return Object.values(methods).some(Boolean) ? methods : defaults.settings.paymentMethods; })(),
      shippingZones: Array.isArray(parsed?.settings?.shippingZones) ? parsed!.settings!.shippingZones : defaults.settings.shippingZones,
    }
  };
}

export function readOperationsState(): StudioOperationsState {
  if (!browserStorage()) return structuredClone(DEFAULT_OPERATIONS_STATE);
  try {
    const raw = window.localStorage.getItem(OPERATIONS_STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_OPERATIONS_STATE);
    return mergeState(JSON.parse(raw) as Partial<StudioOperationsState>);
  } catch { return structuredClone(DEFAULT_OPERATIONS_STATE); }
}

export function writeOperationsState(state: StudioOperationsState) {
  if (!browserStorage()) return;
  window.localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<StudioOperationsState>(OPERATIONS_EVENT, { detail: state }));
}

export function promotionIsActive(promotion: StudioPromotion, now = new Date()) {
  if (!promotion.enabled) return false;
  if (promotion.startsAt && now < new Date(promotion.startsAt)) return false;
  if (promotion.endsAt && now > new Date(promotion.endsAt)) return false;
  return true;
}

export function resolveShippingZone(settings: StudioOperationsSettings, country: string, state: string) {
  const cleanCountry = country.trim().toLowerCase();
  const cleanState = state.trim().toLowerCase();
  const active = settings.shippingZones.filter((zone) => zone.enabled);
  const stateSpecific = active.find((zone) => zone.countries.some((item) => item.toLowerCase() === cleanCountry) && (zone.states?.length ?? 0) > 0 && zone.states!.some((item) => item.toLowerCase() === cleanState));
  if (stateSpecific) return stateSpecific;
  const countryOnly = active.find((zone) => zone.countries.some((item) => item.toLowerCase() === cleanCountry) && !(zone.states?.length));
  if (countryOnly) return countryOnly;
  return active.find((zone) => zone.countries.some((item) => item.toLowerCase() === "international")) ?? null;
}

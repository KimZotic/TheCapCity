export type ProductState = "new" | "limited" | "restock" | "sold-out" | "core";
export type ProductAccent = "signal" | "olive" | "blue" | "ink" | "stone";

export interface Money {
  amount: number;
  currency: "MYR";
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  price: Money;
  state: ProductState;
  category: string;
  style: string;
  accent: ProductAccent;
  image?: string;
  totalStock: number;
  compareAt?: number;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  accent?: ProductAccent;
  priceOverride?: number;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  material: string;
  fit: string;
  closure: string;
  brim: string;
  payungPoints: number;
  variants: ProductVariant[];
  details: string[];
  gallery?: string[];
  colorMedia?: Record<string, string[]>;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategorySummary {
  id: string;
  label: string;
  href: string;
  kicker: string;
  index: string;
}

export interface CampaignSummary {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  tone: "ink" | "signal" | "paper";
  image?: string;
}

export interface EditorialTile {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  treatment: "mono" | "signal" | "paper" | "olive";
  image?: string;
}

export interface HomePageData {
  announcement: string;
  ticker: string[];
  hero: CampaignSummary;
  latestDrop: ProductSummary[];
  categories: CategorySummary[];
  editorial: CampaignSummary;
  editorialTiles: EditorialTile[];
}

export interface CatalogData {
  title: string;
  eyebrow: string;
  description: string;
  products: ProductSummary[];
}

export type CollectionTone = "ink" | "paper" | "olive" | "blue" | "signal";

export interface CollectionSummary {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  kicker: string;
  tone: CollectionTone;
  productSlugs: string[];
  featured: boolean;
  image?: string;
}

export interface CollectionDetail extends CollectionSummary {
  products: ProductSummary[];
}

export type DropStatus = "live" | "upcoming" | "restock";

export interface DropSummary {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  description: string;
  status: DropStatus;
  releaseAt: string;
  collectionSlug?: string;
  productSlugs: string[];
  tone: CollectionTone;
  image?: string;
}

export interface DropDetail extends DropSummary {
  products: ProductSummary[];
  collection?: CollectionSummary;
}

export type DemoOrderStatus = "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "ready-for-pickup" | "collected" | "cancelled" | "refunded";
export type FulfillmentType = "delivery" | "pickup";
export type ShippingMethodId = "delivery" | "pickup";
export type DemoPaymentMethodId = "gateway" | "online-banking" | "ewallet" | "payung-points";

export interface GuestContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  note: string;
}

export interface DemoOrderLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  style: string;
  accent: ProductAccent;
  image?: string;
  variantId: string;
  variantLabel: string;
  color: string;
  size: string;
  unitPrice: number;
  unitPoints?: number;
  pricingMode?: "money" | "points";
  rewardId?: string;
  quantity: number;
}

export interface DemoOrderTimelineEvent {
  status: DemoOrderStatus;
  at: string;
  note: string;
}

export interface DemoOrder {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: DemoOrderStatus;
  fulfillmentType: FulfillmentType;
  contact: GuestContact;
  shippingAddress?: ShippingAddress;
  pickupLocation?: PickupLocation;
  shippingMethod: ShippingMethodId;
  shippingMethodLabel: string;
  paymentMethod: DemoPaymentMethodId;
  paymentMethodLabel: string;
  items: DemoOrderLine[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shipping: number;
  total: number;
  pointsTotal?: number;
  trackingNumber?: string;
  trackingUrl?: string;
  refundAmount?: number;
  refundedAt?: string;
  timeline: DemoOrderTimelineEvent[];
}

export interface CommerceRepository {
  getHomePageData(): Promise<HomePageData>;
  getCatalog(category?: string): Promise<CatalogData>;
  searchProducts(query: string): Promise<ProductSummary[]>;
  getProduct(slug: string): Promise<ProductDetail | null>;
  getCollections(): Promise<CollectionSummary[]>;
  getCollection(slug: string): Promise<CollectionDetail | null>;
  getDrops(): Promise<DropSummary[]>;
  getDrop(slug: string): Promise<DropDetail | null>;
}

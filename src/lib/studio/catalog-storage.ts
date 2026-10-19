"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionSummary, ProductDetail, ProductState, ProductSummary, ProductVariant } from "@/lib/commerce/contracts";
import { demoCollections, demoProductDetails } from "@/lib/demo/data";

export const STUDIO_CATALOG_STORAGE_KEY = "tcc-demo-catalog-v1";
export const STUDIO_CATALOG_EVENT = "tcc:catalog-state";

export interface StudioProductRecord {
  product: ProductDetail;
  published: boolean;
  archived?: boolean;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface StudioCollectionRecord extends CollectionSummary {
  published: boolean;
  archived?: boolean;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  variantId: string;
  delta: number;
  reason: "restock" | "sale-correction" | "damage" | "return" | "count" | "other";
  note?: string;
  staff?: string;
  at: string;
}

export interface StudioCatalogState {
  version: 1;
  products: StudioProductRecord[];
  collections: StudioCollectionRecord[];
  adjustments: InventoryAdjustment[];
  deletedProductIds?: string[];
  deletedCollectionIds?: string[];
}

function now() { return new Date().toISOString(); }

function seededProduct(product: ProductDetail): StudioProductRecord {
  return { product: structuredClone(product), published: true, archived: false, lowStockThreshold: 3, updatedAt: now() };
}

function seededCollection(collection: CollectionSummary): StudioCollectionRecord {
  return { ...structuredClone(collection), published: true, archived: false, updatedAt: now() };
}

export function makeDefaultCatalogState(): StudioCatalogState {
  return {
    version: 1,
    products: demoProductDetails.map(seededProduct),
    collections: demoCollections.map(seededCollection),
    adjustments: [],
    deletedProductIds: [],
    deletedCollectionIds: [],
  };
}

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeState(input?: Partial<StudioCatalogState> | null): StudioCatalogState {
  const fallback = makeDefaultCatalogState();
  if (!input) return fallback;

  const deletedProductIds = Array.isArray(input.deletedProductIds) ? input.deletedProductIds.filter((id): id is string => typeof id === "string") : [];
  const storedProducts = Array.isArray(input.products) ? input.products : [];
  const productMap = new Map(storedProducts.filter((record): record is StudioProductRecord => Boolean(record?.product?.id) && !deletedProductIds.includes(record.product.id)).map((record) => [record.product.id, record]));
  for (const seed of fallback.products) if (!productMap.has(seed.product.id) && !deletedProductIds.includes(seed.product.id)) productMap.set(seed.product.id, seed);

  const deletedCollectionIds = Array.isArray(input.deletedCollectionIds) ? input.deletedCollectionIds.filter((id): id is string => typeof id === "string") : [];
  const storedCollections = Array.isArray(input.collections) ? input.collections : [];
  const collectionMap = new Map(storedCollections.filter((record): record is StudioCollectionRecord => Boolean(record?.id) && !deletedCollectionIds.includes(record.id)).map((record) => [record.id, record]));
  for (const seed of fallback.collections) if (!collectionMap.has(seed.id) && !deletedCollectionIds.includes(seed.id)) collectionMap.set(seed.id, seed);

  return {
    version: 1,
    products: Array.from(productMap.values()).map((record) => ({
      ...record,
      published: record.published !== false,
      archived: record.archived === true,
      lowStockThreshold: Number.isFinite(record.lowStockThreshold) ? Math.max(0, record.lowStockThreshold) : 3,
      updatedAt: record.updatedAt || now(),
      product: {
        ...record.product,
        variants: Array.isArray(record.product.variants) ? record.product.variants : [],
        details: Array.isArray(record.product.details) ? record.product.details : [],
        tags: Array.isArray(record.product.tags) ? record.product.tags : [],
        featured: record.product.featured === true,
      },
    })),
    collections: Array.from(collectionMap.values()).map((record) => ({ ...record, published: record.published !== false, archived: record.archived === true, updatedAt: record.updatedAt || now() })),
    adjustments: Array.isArray(input.adjustments) ? input.adjustments : [],
    deletedProductIds,
    deletedCollectionIds,
  };
}

export function readStudioCatalog(): StudioCatalogState {
  if (!hasStorage()) return makeDefaultCatalogState();
  try {
    const raw = window.localStorage.getItem(STUDIO_CATALOG_STORAGE_KEY);
    if (!raw) return makeDefaultCatalogState();
    return normalizeState(JSON.parse(raw) as Partial<StudioCatalogState>);
  } catch {
    return makeDefaultCatalogState();
  }
}

export function writeStudioCatalog(state: StudioCatalogState) {
  if (!hasStorage()) return;
  const normalized = normalizeState(state);
  window.localStorage.setItem(STUDIO_CATALOG_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent<StudioCatalogState>(STUDIO_CATALOG_EVENT, { detail: normalized }));
}

export function productToSummary(product: ProductDetail): ProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    state: product.state,
    category: product.category,
    style: product.style,
    accent: product.accent,
    image: product.image,
    totalStock: product.totalStock,
    compareAt: product.compareAt,
    featured: product.featured,
  };
}

export function recalculateProduct(product: ProductDetail): ProductDetail {
  const totalStock = product.variants.reduce((sum, variant) => sum + Math.max(0, Number(variant.stock) || 0), 0);
  let state: ProductState = product.state;
  if (totalStock <= 0) state = "sold-out";
  else if (product.state === "sold-out") state = "restock";
  return { ...product, totalStock, state };
}

export function makeProductSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || `product-${Date.now()}`;
}

export function matchesCatalogCategory(product: ProductSummary | ProductDetail, category?: string) {
  if (!category) return true;
  if (category === "flat-brim") return product.style === "Flat Brim";
  if (category === "curved-brim") return product.style === "Curved Brim";
  if (category === "fitted") return product.style === "Fitted";
  if (category === "other-styles") return product.style === "Other Styles";
  if (category === "apparel") return product.category === "Apparel";
  if (category === "tops") return product.category === "Apparel" && product.style === "Tops";
  if (category === "bottoms") return product.category === "Apparel" && product.style === "Bottoms";
  if (category === "special") return product.category === "Accessories";
  if (category === "cap-accessories") return product.style === "Cap Accessories";
  if (category === "bags") return product.style === "Bags";
  if (category === "gift-card") return product.style === "Gift Card";
  if (category === "others") return product.style === "Others";
  if (category === "headwear") return product.category === "Headwear";
  return true;
}

export function makeBlankProduct(): StudioProductRecord {
  const id = `p-custom-${Date.now()}`;
  const slug = `new-product-${Date.now()}`;
  const variant: ProductVariant = { id: `${id}-variant-1`, sku: `TCC-${String(Date.now()).slice(-6)}`, color: "Black", size: "ONE", stock: 0 };
  return {
    published: false,
    archived: false,
    lowStockThreshold: 3,
    updatedAt: now(),
    product: {
      id,
      slug,
      name: "Untitled product",
      price: { amount: 165, currency: "MYR" },
      state: "core",
      category: "Headwear",
      style: "Flat Brim",
      accent: "ink",
      image: "",
      totalStock: 0,
      description: "",
      material: "",
      fit: "",
      closure: "",
      brim: "",
      payungPoints: 495,
      variants: [variant],
      details: [],
      gallery: [],
      colorMedia: {},
      compareAt: undefined,
      featured: false,
      tags: [],
      seoTitle: "",
      seoDescription: "",
    },
  };
}

export function useLiveCatalogState() {
  const [state, setState] = useState<StudioCatalogState>(() => makeDefaultCatalogState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStudioCatalog());
    setHydrated(true);
    const onCatalog = (event: Event) => {
      const custom = event as CustomEvent<StudioCatalogState>;
      setState(custom.detail ? normalizeState(custom.detail) : readStudioCatalog());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STUDIO_CATALOG_STORAGE_KEY) setState(readStudioCatalog());
    };
    window.addEventListener(STUDIO_CATALOG_EVENT, onCatalog);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STUDIO_CATALOG_EVENT, onCatalog);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const update = useCallback((recipe: (current: StudioCatalogState) => StudioCatalogState) => {
    const next = recipe(structuredClone(readStudioCatalog()));
    writeStudioCatalog(next);
    setState(next);
  }, []);

  return { state, hydrated, update };
}

export function useLiveProduct(idOrSlug: string, initial?: ProductDetail | ProductSummary | null) {
  const { state, hydrated } = useLiveCatalogState();
  const record = useMemo(() => state.products.find((item) => item.product.id === idOrSlug || item.product.slug === idOrSlug), [state.products, idOrSlug]);
  const product = record?.product ?? initial ?? null;
  return { product, record, hydrated };
}

export function visibleProductSummaries(state: StudioCatalogState, category?: string) {
  return state.products.filter((record) => record.published && !record.archived && matchesCatalogCategory(record.product, category)).map((record) => productToSummary(record.product));
}

export function visibleCollections(state: StudioCatalogState) {
  return state.collections.filter((collection) => collection.published && !collection.archived);
}

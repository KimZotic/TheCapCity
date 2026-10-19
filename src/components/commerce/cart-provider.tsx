"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PayungReward, PayungRewardVariant } from "@/lib/account/contracts";
import type { ProductDetail, ProductVariant } from "@/lib/commerce/contracts";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { usePayungProgram } from "@/components/account/payung-program-provider";
import { useOperations } from "@/components/commerce/operations-provider";
import { promotionIsActive } from "@/lib/studio/operations-storage";

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  style: string;
  accent: ProductDetail["accent"];
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
  availableStock: number;
}

interface PromoState { code: string; kind: "percent" | "fixed"; value: number; }
interface CartActionResult { ok: boolean; message: string; }

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  pointsTotal: number;
  cartMode: "money" | "points";
  discount: number;
  shipping: number;
  total: number;
  promo: PromoState | null;
  isCartOpen: boolean;
  addItem: (product: ProductDetail, variant: ProductVariant, quantity: number, imageOverride?: string) => CartActionResult;
  addRewardItem: (reward: PayungReward, variant?: PayungRewardVariant) => CartActionResult;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => CartActionResult;
  removePromo: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tcc-demo-commerce-v1";

function clampQuantity(value: number, stock: number) {
  return Math.max(1, Math.min(Math.floor(value || 1), Math.max(stock, 1)));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { state: catalog } = useCatalog();
  const { state: payungProgram } = usePayungProgram();
  const { state: operations } = useOperations();
  const [items, setItems] = useState<CartLine[]>([]);
  const [promo, setPromo] = useState<PromoState | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartLine[]; promo?: PromoState | null };
        if (Array.isArray(parsed.items)) setItems(parsed.items.map((line) => ({ ...line, pricingMode: line.pricingMode ?? "money" })));
        if (parsed.promo && typeof parsed.promo.code === "string") setPromo(parsed.promo);
      }
    } catch { /* persistence must never block the storefront */ }
    finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promo })); }
    catch { /* private mode / quota: keep demo usable */ }
  }, [hydrated, items, promo]);

  useEffect(() => {
    if (!hydrated) return;
    setItems((current) => {
      let changed = false;
      const next = current.map((line) => {
        if (line.pricingMode === "points") return line;
        const record = catalog.products.find((item) => item.product.id === line.productId || item.product.slug === line.slug);
        if (!record) return line;
        const variant = record.product.variants.find((item) => item.id === line.variantId);
        if (!variant) return line;
        const unitPrice = variant.priceOverride ?? record.product.price.amount;
        const availableStock = Math.max(0, variant.stock);
        const quantity = Math.max(1, Math.min(line.quantity, Math.max(availableStock, 1)));
        const image = record.product.colorMedia?.[variant.color]?.[0] ?? record.product.image ?? line.image;
        const candidate = { ...line, name: record.product.name, category: record.product.category, style: record.product.style, unitPrice, availableStock, quantity, image };
        if (candidate.name !== line.name || candidate.category !== line.category || candidate.style !== line.style || candidate.unitPrice !== line.unitPrice || candidate.availableStock !== line.availableStock || candidate.quantity !== line.quantity || candidate.image !== line.image) changed = true;
        return candidate;
      });
      return changed ? next : current;
    });
  }, [catalog.products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setItems((current) => {
      let changed = false;
      const next = current.map((line) => {
        if (line.pricingMode !== "points") return line;
        const reward = payungProgram.rewards.find((item) => item.id === line.rewardId);
        if (!reward) return line;
        const variant = reward.variants.find((item) => item.id === line.variantId);
        const availableStock = reward.status === "active" ? Math.max(0, variant?.stock ?? 0) : 0;
        const image = variant?.image ?? reward.image ?? line.image;
        const candidate = { ...line, name: reward.name, category: reward.category, unitPoints: reward.points, availableStock, image };
        if (candidate.name !== line.name || candidate.category !== line.category || candidate.unitPoints !== line.unitPoints || candidate.availableStock !== line.availableStock || candidate.image !== line.image) changed = true;
        return candidate;
      });
      return changed ? next : current;
    });
  }, [payungProgram.rewards, hydrated]);

  const cartMode: "money" | "points" = items.some((line) => line.pricingMode === "points") ? "points" : "money";

  const addItem = useCallback((product: ProductDetail, variant: ProductVariant, quantity: number, imageOverride?: string): CartActionResult => {
    if (items.some((line) => line.pricingMode === "points")) return { ok: false, message: "Finish or clear the Payung redemption bag before adding store products." };
    const key = `${product.id}:${variant.id}`;
    setItems((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) return current.map((line) => line.key === key ? { ...line, quantity: clampQuantity(line.quantity + quantity, variant.stock), availableStock: variant.stock } : line);
      const hiddenSizes = new Set(["OS", "ONE", "OSFM", "ONE SIZE", "DIGITAL"]);
      const meaningfulSize = variant.size && !hiddenSizes.has(variant.size.trim().toUpperCase());
      return [...current, {
        key, productId: product.id, slug: product.slug, name: product.name, category: product.category, style: product.style,
        accent: variant.accent ?? product.accent, image: imageOverride ?? product.image, variantId: variant.id,
        variantLabel: meaningfulSize ? `${variant.color} / ${variant.size}` : variant.color,
        color: variant.color, size: variant.size, unitPrice: variant.priceOverride ?? product.price.amount,
        pricingMode: "money", quantity: clampQuantity(quantity, variant.stock), availableStock: variant.stock
      }];
    });
    setCartOpen(true);
    return { ok: true, message: "Added to bag." };
  }, [items]);

  const addRewardItem = useCallback((reward: PayungReward, selectedVariant?: PayungRewardVariant): CartActionResult => {
    if (items.some((line) => line.pricingMode !== "points")) return { ok: false, message: "Finish or clear the shopping bag before starting a Payung redemption." };
    const variant = selectedVariant ?? reward.variants.find((item) => item.stock > 0) ?? reward.variants[0];
    if (!variant || variant.stock <= 0) return { ok: false, message: "That Payung reward variant is currently unavailable." };
    setItems([{
      key: `payung:${reward.id}:${variant.id}`,
      productId: reward.id,
      slug: reward.slug,
      name: reward.name,
      category: reward.category,
      style: "Payung Reward",
      accent: "ink",
      image: variant.image ?? reward.image,
      variantId: variant.id,
      variantLabel: variant.optionLabel && variant.optionValue ? `${variant.optionLabel}: ${variant.optionValue}` : variant.label,
      color: variant.optionLabel === "Colour" ? (variant.optionValue ?? variant.label) : "Payung reward",
      size: variant.optionLabel === "Size" ? (variant.optionValue ?? variant.label) : "ONE",
      unitPrice: 0,
      unitPoints: reward.points,
      pricingMode: "points",
      rewardId: reward.id,
      quantity: 1,
      availableStock: variant.stock
    }]);
    setPromo(null);
    setCartOpen(true);
    return { ok: true, message: "Added to Payung bag." };
  }, [items]);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) => current.map((line) => line.key === key ? { ...line, quantity: line.pricingMode === "points" ? 1 : clampQuantity(quantity, line.availableStock) } : line));
  }, []);
  const removeItem = useCallback((key: string) => setItems((current) => current.filter((line) => line.key !== key)), []);
  const clearCart = useCallback(() => { setItems([]); setPromo(null); }, []);

  const applyPromo = useCallback((input: string): CartActionResult => {
    if (items.some((line) => line.pricingMode === "points")) return { ok: false, message: "Discount codes do not apply to Payung rewards." };
    const code = input.trim().toUpperCase();
    const match = operations.promotions.find((item) => item.code.trim().toUpperCase() === code && promotionIsActive(item));
    if (!match) { setPromo(null); return { ok: false, message: "That code is not active." }; }
    if (match.usageLimit > 0 && match.uses >= match.usageLimit) { setPromo(null); return { ok: false, message: "That code has reached its usage limit." }; }
    const currentSubtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    if (currentSubtotal < match.minSpend) { setPromo(null); return { ok: false, message: `Minimum spend is RM${match.minSpend.toFixed(2)}.` }; }
    const eligibleSlugs = new Set(match.eligibleProductSlugs);
    for (const collectionSlug of match.eligibleCollectionSlugs) {
      const collection = catalog.collections.find((item) => item.slug === collectionSlug && item.published && !item.archived);
      collection?.productSlugs.forEach((slug) => eligibleSlugs.add(slug));
    }
    const restricted = eligibleSlugs.size > 0;
    if (restricted && !items.some((line) => eligibleSlugs.has(line.slug))) { setPromo(null); return { ok: false, message: "This code does not apply to the items in your bag." }; }
    setPromo({ code: match.code.toUpperCase(), kind: match.kind, value: match.value });
    return { ok: true, message: match.kind === "percent" ? `${match.value}% discount applied.` : `RM${match.value.toFixed(2)} discount applied.` };
  }, [items, operations.promotions, catalog.collections]);

  const count = items.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const pointsTotal = items.reduce((sum, line) => sum + (line.unitPoints ?? 0) * line.quantity, 0);
  const activePromoConfig = promo ? operations.promotions.find((item) => item.code.toUpperCase() === promo.code.toUpperCase() && promotionIsActive(item) && (item.usageLimit <= 0 || item.uses < item.usageLimit)) : undefined;
  const promoEligibleSubtotal = activePromoConfig ? items.filter((line) => {
    if (!activePromoConfig.eligibleProductSlugs.length && !activePromoConfig.eligibleCollectionSlugs.length) return true;
    if (activePromoConfig.eligibleProductSlugs.includes(line.slug)) return true;
    return activePromoConfig.eligibleCollectionSlugs.some((collectionSlug) => catalog.collections.find((collection) => collection.slug === collectionSlug && collection.published && !collection.archived)?.productSlugs.includes(line.slug));
  }).reduce((sum,line)=>sum+line.unitPrice*line.quantity,0) : 0;
  const discount = cartMode === "money" && promo && activePromoConfig ? Math.min(promoEligibleSubtotal, promo.kind === "percent" ? promoEligibleSubtotal * (promo.value / 100) : promo.value) : 0;
  const shipping = 0;
  const total = Math.max(0, subtotal - discount);

  const value = useMemo<CartContextValue>(() => ({
    items, count, subtotal, pointsTotal, cartMode, discount, shipping, total, promo, isCartOpen,
    addItem, addRewardItem, setQuantity, removeItem, clearCart, applyPromo,
    removePromo: () => setPromo(null), openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false)
  }), [items, count, subtotal, pointsTotal, cartMode, discount, shipping, total, promo, isCartOpen, addItem, addRewardItem, setQuantity, removeItem, clearCart, applyPromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

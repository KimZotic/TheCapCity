import type {
  DemoOrder,
  DemoOrderLine,
  DemoOrderStatus,
  DemoPaymentMethodId,
  FulfillmentType,
  GuestContact,
  PickupLocation,
  ShippingAddress,
  ShippingMethodId
} from "@/lib/commerce/contracts";

const STORAGE_KEY = "tcc-demo-orders-v1";
const MAX_ORDERS = 40;

const statusNotes: Record<DemoOrderStatus, string> = {
  confirmed: "Order received and confirmed in the TCC demo system.",
  processing: "The order is being prepared for fulfilment.",
  packed: "Items are packed and ready for the next fulfilment step.",
  shipped: "The order has left fulfilment and is on the way.",
  delivered: "Delivery completed in the demo tracking flow.",
  "ready-for-pickup": "The order is ready for collection at the TCC flagship store.",
  collected: "Store pickup completed in the demo flow.",
  cancelled: "The order was cancelled in Commerce Studio.",
  refunded: "The order was refunded in Commerce Studio."
};

const deliveryStatusOrder: DemoOrderStatus[] = ["confirmed", "processing", "packed", "shipped", "delivered"];
const pickupStatusOrder: DemoOrderStatus[] = ["confirmed", "processing", "packed", "ready-for-pickup", "collected"];

export interface CreateDemoOrderInput {
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
  referencePrefix?: string;
}

function browserStorageAvailable() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function parseOrders(raw: string | null): DemoOrder[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order): order is DemoOrder => {
      if (!order || typeof order !== "object") return false;
      const candidate = order as Partial<DemoOrder>;
      return typeof candidate.reference === "string" && typeof candidate.createdAt === "string" && Array.isArray(candidate.items);
    }).map((order) => ({ ...order, fulfillmentType: order.fulfillmentType ?? (order.shippingMethod === "pickup" ? "pickup" : "delivery") }));
  } catch { return []; }
}
function writeOrders(orders: DemoOrder[]) { if (!browserStorageAvailable()) return; window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.slice(0, MAX_ORDERS))); }
function randomSuffix() { if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") { const buffer = new Uint32Array(1); crypto.getRandomValues(buffer); return (buffer[0] % 10000).toString().padStart(4, "0"); } return Math.floor(Math.random() * 10000).toString().padStart(4, "0"); }
function makeReference(now: Date, prefix = "TCC") { const yy = String(now.getFullYear()).slice(-2); const mm = String(now.getMonth() + 1).padStart(2, "0"); const dd = String(now.getDate()).padStart(2, "0"); const clean = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "TCC"; return `${clean}-${yy}${mm}${dd}-${randomSuffix()}`; }
function makeId() { if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID(); return `order-${Date.now()}-${randomSuffix()}`; }
function normalize(value: string) { return value.trim().toLowerCase(); }
function normalizePhone(value: string) { return value.replace(/\D/g, ""); }

export function listDemoOrders(): DemoOrder[] { if (!browserStorageAvailable()) return []; return parseOrders(window.localStorage.getItem(STORAGE_KEY)); }
export function getDemoOrder(reference: string): DemoOrder | null { const normalizedReference = reference.trim().toUpperCase(); return listDemoOrders().find((order) => order.reference.toUpperCase() === normalizedReference) ?? null; }
export function findDemoOrder(reference: string, contactIdentifier: string): DemoOrder | null {
  const order = getDemoOrder(reference); if (!order) return null;
  const input = normalize(contactIdentifier); const emailMatches = normalize(order.contact.email) === input; const phoneMatches = normalizePhone(order.contact.phone) === normalizePhone(contactIdentifier) && normalizePhone(contactIdentifier).length >= 8;
  return emailMatches || phoneMatches ? order : null;
}

export function createDemoOrder(input: CreateDemoOrderInput): DemoOrder {
  const now = new Date(); let reference = makeReference(now, input.referencePrefix); const existing = listDemoOrders(); while (existing.some((order) => order.reference === reference)) reference = makeReference(now, input.referencePrefix);
  const timestamp = now.toISOString();
  const order: DemoOrder = {
    id: makeId(), reference, createdAt: timestamp, updatedAt: timestamp, status: "confirmed", fulfillmentType: input.fulfillmentType,
    contact: input.contact, shippingAddress: input.shippingAddress, pickupLocation: input.pickupLocation, shippingMethod: input.shippingMethod, shippingMethodLabel: input.shippingMethodLabel,
    paymentMethod: input.paymentMethod, paymentMethodLabel: input.paymentMethodLabel, items: input.items, subtotal: input.subtotal, discount: input.discount,
    promoCode: input.promoCode, shipping: input.shipping, total: input.total, pointsTotal: input.pointsTotal, timeline: [{ status: "confirmed", at: timestamp, note: statusNotes.confirmed }]
  };
  writeOrders([order, ...existing]); return order;
}

export function advanceDemoOrderStatus(reference: string): DemoOrder | null {
  const orders = listDemoOrders(); const index = orders.findIndex((order) => order.reference.toUpperCase() === reference.trim().toUpperCase()); if (index < 0) return null;
  const current = orders[index]; if (["cancelled","refunded"].includes(current.status)) return current; const sequence = current.fulfillmentType === "pickup" ? pickupStatusOrder : deliveryStatusOrder; const currentIndex = sequence.indexOf(current.status); const safeIndex = currentIndex >= 0 ? currentIndex : 0; const nextStatus = sequence[Math.min(safeIndex + 1, sequence.length - 1)]; if (nextStatus === current.status) return current;
  const timestamp = new Date().toISOString(); const updated: DemoOrder = { ...current, status: nextStatus, updatedAt: timestamp, timeline: [...current.timeline, { status: nextStatus, at: timestamp, note: statusNotes[nextStatus] }] };
  orders[index] = updated; writeOrders(orders); return updated;
}

export function getDemoOrderStatusSequence(order: Pick<DemoOrder, "fulfillmentType" | "status">): DemoOrderStatus[] { if (order.status === "cancelled" || order.status === "refunded") return [order.status]; return order.fulfillmentType === "pickup" ? pickupStatusOrder : deliveryStatusOrder; }


export function refundDemoOrder(reference: string, amount?: number): DemoOrder | null {
  const orders = listDemoOrders();
  const index = orders.findIndex((order) => order.reference.toUpperCase() === reference.trim().toUpperCase());
  if (index < 0) return null;
  const current = orders[index];
  if (current.paymentMethod === "payung-points") return current;
  const refundAmount = Math.max(0, Math.min(typeof amount === "number" ? amount : current.total, current.total));
  const timestamp = new Date().toISOString();
  const updated: DemoOrder = { ...current, status: "refunded", refundAmount, refundedAt: timestamp, updatedAt: timestamp, timeline: [...current.timeline, { status: "refunded", at: timestamp, note: statusNotes.refunded }] };
  orders[index] = updated; writeOrders(orders); return updated;
}

export function cancelDemoOrder(reference: string): DemoOrder | null {
  const orders = listDemoOrders();
  const index = orders.findIndex((order) => order.reference.toUpperCase() === reference.trim().toUpperCase());
  if (index < 0) return null;
  const current = orders[index];
  if (["delivered","collected","refunded","cancelled"].includes(current.status)) return current;
  const timestamp = new Date().toISOString();
  const updated: DemoOrder = { ...current, status: "cancelled", updatedAt: timestamp, timeline: [...current.timeline, { status: "cancelled", at: timestamp, note: statusNotes.cancelled }] };
  orders[index] = updated; writeOrders(orders); return updated;
}

export function updateDemoOrderTracking(reference: string, trackingNumber: string, trackingUrl: string): DemoOrder | null {
  const orders = listDemoOrders();
  const index = orders.findIndex((order) => order.reference.toUpperCase() === reference.trim().toUpperCase());
  if (index < 0) return null;
  const current = orders[index];
  const updated: DemoOrder = { ...current, trackingNumber: trackingNumber.trim() || undefined, trackingUrl: trackingUrl.trim() || undefined, updatedAt: new Date().toISOString() };
  orders[index] = updated; writeOrders(orders); return updated;
}

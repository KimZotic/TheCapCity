import type { DemoCustomer, PayungActivity } from "@/lib/account/contracts";
import { listDemoOrders } from "@/lib/services/demo-order-service";

export interface CustomerDirectoryEntry extends DemoCustomer {
  note?: string;
  lastSeenAt?: string;
}

interface CustomerDirectoryState {
  customers: CustomerDirectoryEntry[];
  activities: Record<string, PayungActivity[]>;
}

interface StoredAccountState {
  member: DemoCustomer | null;
  signedIn: boolean;
  activities: PayungActivity[];
}

export const CUSTOMER_DIRECTORY_KEY = "tcc-demo-customers-v1";
export const CUSTOMER_DIRECTORY_EVENT = "tcc:customers";
export const ACCOUNT_STORAGE_KEY = "tcc-demo-account-v3";
export const ACCOUNT_STATE_EVENT = "tcc:account-state";

const seededCustomers: CustomerDirectoryEntry[] = [
  {
    id: "customer-demo-payung",
    firstName: "Aiman",
    lastName: "TCC",
    email: "member@tcc.demo",
    phone: "+60 12 345 6789",
    birthday: "1998-08-31",
    joinedAt: "2026-01-12T10:00:00+08:00",
    points: 8420,
    lifetimeSpend: 7820,
    redeemedRewardIds: [],
    note: "Demo Silver Cup member",
  },
  {
    id: "customer-seed-2",
    firstName: "Nadia",
    lastName: "Rahman",
    email: "nadia@example.com",
    phone: "+60 17 221 8840",
    joinedAt: "2026-03-18T11:30:00+08:00",
    points: 980,
    lifetimeSpend: 3260,
    redeemedRewardIds: [],
  },
  {
    id: "customer-seed-3",
    firstName: "Irfan",
    lastName: "Low",
    email: "irfan@example.com",
    phone: "+60 12 848 3001",
    joinedAt: "2025-11-02T14:05:00+08:00",
    points: 12860,
    lifetimeSpend: 33840,
    redeemedRewardIds: ["reward-pin"],
  },
  {
    id: "customer-seed-4",
    firstName: "Sarah",
    lastName: "Lim",
    email: "sarah@example.com",
    phone: "+60 16 933 7311",
    joinedAt: "2026-05-21T09:15:00+08:00",
    points: 270,
    lifetimeSpend: 890,
    redeemedRewardIds: [],
  },
];

const seededActivities: Record<string, PayungActivity[]> = {
  "customer-demo-payung": [
    { id: "a-1", label: "Online purchase", points: 495, at: "2026-10-12T13:30:00+08:00" },
    { id: "a-2", label: "Flagship store purchase", points: 645, at: "2026-09-26T16:10:00+08:00" },
    { id: "a-3", label: "Birthday bonus", points: 300, at: "2026-08-31T09:00:00+08:00" },
  ],
};

function browserReady() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function makeOrderCustomerId(email: string) {
  return `customer-order-${email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "guest"}`;
}

function readPersistedState(): CustomerDirectoryState {
  if (!browserReady()) return { customers: [], activities: {} };
  try {
    const raw = window.localStorage.getItem(CUSTOMER_DIRECTORY_KEY);
    if (!raw) return { customers: [], activities: {} };
    const parsed = JSON.parse(raw) as Partial<CustomerDirectoryState>;
    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      activities: parsed.activities && typeof parsed.activities === "object" ? parsed.activities : {},
    };
  } catch {
    return { customers: [], activities: {} };
  }
}

function readAccountState(): StoredAccountState | null {
  if (!browserReady()) return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAccountState>;
    return {
      member: parsed.member ?? null,
      signedIn: Boolean(parsed.signedIn && parsed.member),
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    };
  } catch {
    return null;
  }
}

function writeAccountState(next: StoredAccountState) {
  if (!browserReady()) return;
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent<StoredAccountState>(ACCOUNT_STATE_EVENT, { detail: next }));
}

function writeDirectory(state: CustomerDirectoryState) {
  if (!browserReady()) return;
  window.localStorage.setItem(CUSTOMER_DIRECTORY_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<CustomerDirectoryState>(CUSTOMER_DIRECTORY_EVENT, { detail: state }));
}

function dedupeCustomers(customers: CustomerDirectoryEntry[]) {
  const byEmail = new Map<string, CustomerDirectoryEntry>();
  customers.forEach((customer) => {
    const key = customer.email.trim().toLowerCase();
    const current = byEmail.get(key);
    byEmail.set(key, current ? { ...current, ...customer, id: current.id || customer.id } : customer);
  });
  return [...byEmail.values()];
}

export function readCustomerDirectory(): CustomerDirectoryEntry[] {
  const persisted = readPersistedState();
  const account = readAccountState();
  const orders = browserReady() ? listDemoOrders() : [];
  const orderCustomers: CustomerDirectoryEntry[] = [];

  const grouped = new Map<string, typeof orders>();
  orders.forEach((order) => {
    const email = order.contact.email.trim().toLowerCase();
    grouped.set(email, [...(grouped.get(email) ?? []), order]);
  });
  grouped.forEach((items, email) => {
    const newest = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const oldest = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
    if (!newest || !oldest) return;
    orderCustomers.push({
      id: makeOrderCustomerId(email),
      firstName: newest.contact.firstName,
      lastName: newest.contact.lastName,
      email,
      phone: newest.contact.phone,
      joinedAt: oldest.createdAt,
      points: 0,
      lifetimeSpend: items.reduce((sum, order) => sum + (order.paymentMethod === "payung-points" ? 0 : order.total), 0),
      redeemedRewardIds: [],
      defaultAddress: newest.shippingAddress ? {
        address1: newest.shippingAddress.address1,
        address2: newest.shippingAddress.address2,
        city: newest.shippingAddress.city,
        postcode: newest.shippingAddress.postcode,
        state: newest.shippingAddress.state,
        country: newest.shippingAddress.country,
      } : undefined,
      lastSeenAt: newest.createdAt,
    });
  });

  return dedupeCustomers([
    ...seededCustomers,
    ...orderCustomers,
    ...persisted.customers,
    ...(account?.member ? [account.member] : []),
  ]).sort((a, b) => (b.lastSeenAt ?? b.joinedAt).localeCompare(a.lastSeenAt ?? a.joinedAt));
}

export function readCustomerActivities(customerId: string): PayungActivity[] {
  const persisted = readPersistedState();
  const account = readAccountState();
  if (account?.member?.id === customerId) return account.activities;
  return persisted.activities[customerId] ?? seededActivities[customerId] ?? [];
}

export function syncAccountMemberToDirectory(member: DemoCustomer | null, activities: PayungActivity[]) {
  if (!browserReady() || !member) return;
  const state = readPersistedState();
  const customers = dedupeCustomers([...state.customers.filter((item) => item.id !== member.id && item.email.toLowerCase() !== member.email.toLowerCase()), member]);
  writeDirectory({ customers, activities: { ...state.activities, [member.id]: activities } });
}

export function saveCustomerRecord(next: CustomerDirectoryEntry) {
  const state = readPersistedState();
  const customers = dedupeCustomers([...state.customers.filter((item) => item.id !== next.id && item.email.toLowerCase() !== next.email.toLowerCase()), next]);
  const account = readAccountState();
  if (account?.member && (account.member.id === next.id || account.member.email.toLowerCase() === next.email.toLowerCase())) {
    writeAccountState({ ...account, member: { ...account.member, ...next } });
  }
  writeDirectory({ ...state, customers });
}

export function adjustCustomerPoints(customerId: string, delta: number, note: string) {
  const customers = readCustomerDirectory();
  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return null;
  const next = { ...customer, points: Math.max(0, Math.round(customer.points + delta)) };
  const activity: PayungActivity = { id: `studio-points-${Date.now()}`, label: note || "Studio points adjustment", points: Math.round(delta), at: new Date().toISOString() };
  const state = readPersistedState();
  const activities = { ...state.activities, [next.id]: [activity, ...(state.activities[next.id] ?? seededActivities[next.id] ?? [])].slice(0, 30) };
  const nextState = { customers: dedupeCustomers([...state.customers.filter((item) => item.id !== next.id && item.email.toLowerCase() !== next.email.toLowerCase()), next]), activities };
  const account = readAccountState();
  if (account?.member && (account.member.id === next.id || account.member.email.toLowerCase() === next.email.toLowerCase())) {
    writeAccountState({ ...account, member: { ...account.member, ...next }, activities: [activity, ...account.activities].slice(0, 30) });
  }
  writeDirectory(nextState);
  return next;
}

export function setCustomerLifetimeSpend(customerId: string, lifetimeSpend: number, note = "Studio tier/spend adjustment") {
  const customers = readCustomerDirectory();
  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return null;
  const next = { ...customer, lifetimeSpend: Math.max(0, Math.round(lifetimeSpend * 100) / 100) };
  saveCustomerRecord(next);
  const state = readPersistedState();
  const activity: PayungActivity = { id: `studio-spend-${Date.now()}`, label: note, points: 0, at: new Date().toISOString() };
  writeDirectory({ ...state, activities: { ...state.activities, [next.id]: [activity, ...(state.activities[next.id] ?? [])].slice(0, 30) } });
  return next;
}

export function saveCustomerNote(customerId: string, note: string) {
  const customer = readCustomerDirectory().find((item) => item.id === customerId);
  if (!customer) return null;
  const next = { ...customer, note };
  saveCustomerRecord(next);
  return next;
}

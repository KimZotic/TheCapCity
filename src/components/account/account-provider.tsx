"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DemoCustomer, PayungActivity } from "@/lib/account/contracts";
import { getActivePayungRewards, readPayungProgramState } from "@/lib/account/payung-storage";
import { ACCOUNT_STATE_EVENT, ACCOUNT_STORAGE_KEY, readCustomerActivities, readCustomerDirectory, syncAccountMemberToDirectory } from "@/lib/account/customer-storage";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
}

interface AccountContextValue {
  customer: DemoCustomer | null;
  activities: PayungActivity[];
  hydrated: boolean;
  signIn: (email: string, password: string) => { ok: boolean; message: string };
  useDemoMember: () => void;
  register: (input: RegisterInput, password: string) => { ok: boolean; message: string };
  signOut: () => void;
  updateProfile: (changes: Partial<Pick<DemoCustomer, "firstName" | "lastName" | "phone" | "birthday" | "defaultAddress">>) => void;
  redeemReward: (rewardId: string) => { ok: boolean; message: string };
  recordPurchase: (amount: number, reference: string, email: string) => void;
}

interface StoredAccountState {
  member: DemoCustomer | null;
  signedIn: boolean;
  activities: PayungActivity[];
}

const STORAGE_KEY = ACCOUNT_STORAGE_KEY;
const LEGACY_STORAGE_KEY = "tcc-demo-account-v2";
const AccountContext = createContext<AccountContextValue | null>(null);

const demoMember: DemoCustomer = {
  id: "customer-demo-payung",
  firstName: "Aiman",
  lastName: "TCC",
  email: "member@tcc.demo",
  phone: "+60 12 345 6789",
  birthday: "1998-08-31",
  joinedAt: "2026-01-12T10:00:00+08:00",
  points: 8420,
  lifetimeSpend: 7820,
  redeemedRewardIds: []
};

const demoActivities: PayungActivity[] = [
  { id: "a-1", label: "Online purchase", points: 495, at: "2026-10-12T13:30:00+08:00" },
  { id: "a-2", label: "Flagship store purchase", points: 645, at: "2026-09-26T16:10:00+08:00" },
  { id: "a-3", label: "Birthday bonus", points: 300, at: "2026-08-31T09:00:00+08:00" }
];

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `customer-${Date.now()}`;
}

function safeParse(raw: string | null): StoredAccountState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredAccountState> & { customer?: DemoCustomer | null };
    const member = parsed.member ?? parsed.customer ?? null;
    const signedIn = typeof parsed.signedIn === "boolean" ? parsed.signedIn : Boolean(parsed.customer);
    return { member, signedIn, activities: Array.isArray(parsed.activities) ? parsed.activities : [] };
  } catch {
    return null;
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<DemoCustomer | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [activities, setActivities] = useState<PayungActivity[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const customer = signedIn ? member : null;

  useEffect(() => {
    const saved = safeParse(window.localStorage.getItem(STORAGE_KEY)) ?? safeParse(window.localStorage.getItem(LEGACY_STORAGE_KEY));
    if (saved) {
      setMember(saved.member);
      setSignedIn(saved.signedIn && Boolean(saved.member));
      setActivities(saved.activities);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ member, signedIn, activities } satisfies StoredAccountState));
      syncAccountMemberToDirectory(member, activities);
    } catch { /* demo persistence must not block UI */ }
  }, [member, signedIn, activities, hydrated]);

  useEffect(() => {
    function onAccountState(event: Event) {
      const detail = (event as CustomEvent<StoredAccountState>).detail;
      if (!detail) return;
      setMember(detail.member ?? null);
      setSignedIn(Boolean(detail.signedIn && detail.member));
      setActivities(Array.isArray(detail.activities) ? detail.activities : []);
    }
    window.addEventListener(ACCOUNT_STATE_EVENT, onAccountState);
    return () => window.removeEventListener(ACCOUNT_STATE_EVENT, onAccountState);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) return { ok: false, message: "Enter a valid email address." };
    if (password.trim().length < 4) return { ok: false, message: "Enter your password." };
    if (member && member.email.toLowerCase() === normalized) {
      setSignedIn(true);
      return { ok: true, message: "Welcome back." };
    }
    if (normalized === demoMember.email) {
      const savedMember = readCustomerDirectory().find((item) => item.email.toLowerCase() === normalized) ?? demoMember;
      setMember(savedMember);
      setActivities(readCustomerActivities(savedMember.id).length ? readCustomerActivities(savedMember.id) : demoActivities);
      setSignedIn(true);
      return { ok: true, message: "Demo member loaded." };
    }
    return { ok: false, message: "No demo member found for that email. Create an account or use the demo member." };
  }, [member]);

  const useDemoMember = useCallback(() => {
    const savedMember = readCustomerDirectory().find((item) => item.email.toLowerCase() === demoMember.email) ?? demoMember;
    setMember(savedMember);
    const savedActivities = readCustomerActivities(savedMember.id);
    setActivities(savedActivities.length ? savedActivities : demoActivities);
    setSignedIn(true);
  }, []);

  const register = useCallback((input: RegisterInput, password: string) => {
    if (!input.firstName.trim() || !input.lastName.trim()) return { ok: false, message: "Enter your name." };
    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) return { ok: false, message: "Enter a valid email address." };
    if (password.trim().length < 4) return { ok: false, message: "Use at least 4 characters for the demo password." };
    const next: DemoCustomer = {
      id: makeId(), firstName: input.firstName.trim(), lastName: input.lastName.trim(), email: input.email.trim().toLowerCase(), phone: input.phone.trim(), birthday: input.birthday,
      joinedAt: new Date().toISOString(), points: readPayungProgramState().settings.joinBonus, lifetimeSpend: 0, redeemedRewardIds: []
    };
    setMember(next);
    setSignedIn(true);
    const joinBonus = readPayungProgramState().settings.joinBonus;
    setActivities([{ id: `join-${Date.now()}`, label: "Joined Payung Program", points: joinBonus, at: new Date().toISOString() }]);
    return { ok: true, message: "Account created." };
  }, []);

  const signOut = useCallback(() => setSignedIn(false), []);
  const updateProfile = useCallback((changes: Partial<Pick<DemoCustomer, "firstName" | "lastName" | "phone" | "birthday" | "defaultAddress">>) => {
    if (!signedIn) return;
    setMember((current) => current ? { ...current, ...changes } : current);
  }, [signedIn]);

  const redeemReward = useCallback((rewardId: string) => {
    const reward = getActivePayungRewards().find((item) => item.id === rewardId);
    if (!reward || !customer) return { ok: false, message: "Sign in to redeem rewards." };
    if (customer.redeemedRewardIds.includes(rewardId)) return { ok: false, message: "This demo reward has already been redeemed." };
    if (customer.points < reward.points) return { ok: false, message: "Not enough Payung Points yet." };
    setMember((current) => current ? { ...current, points: current.points - reward.points, redeemedRewardIds: [...current.redeemedRewardIds, rewardId] } : current);
    setActivities((current) => [{ id: `redeem-${Date.now()}`, label: `Redeemed · ${reward.name}`, points: -reward.points, at: new Date().toISOString() }, ...current]);
    return { ok: true, message: `${reward.name} redeemed in demo mode.` };
  }, [customer]);

  const recordPurchase = useCallback((amount: number, reference: string, email: string) => {
    if (!customer || customer.email.toLowerCase() !== email.trim().toLowerCase()) return;
    const points = Math.max(0, Math.round(amount * readPayungProgramState().settings.pointsPerRM));
    setMember((current) => current ? { ...current, points: current.points + points, lifetimeSpend: current.lifetimeSpend + amount } : current);
    setActivities((current) => [{ id: `purchase-${reference}`, label: `Purchase · ${reference}`, points, at: new Date().toISOString() }, ...current]);
  }, [customer]);

  const value = useMemo<AccountContextValue>(() => ({ customer, activities, hydrated, signIn, useDemoMember, register, signOut, updateProfile, redeemReward, recordPurchase }), [customer, activities, hydrated, signIn, useDemoMember, register, signOut, updateProfile, redeemReward, recordPurchase]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used inside AccountProvider");
  return context;
}

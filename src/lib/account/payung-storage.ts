import type { PayungReward } from "@/lib/account/contracts";
import { payungRewards } from "@/lib/account/payung-data";

export type PayungRewardStatus = "active" | "draft" | "archived";

export interface ManagedPayungReward extends PayungReward {
  status: PayungRewardStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PayungProgramSettings {
  pointsPerRM: number;
  joinBonus: number;
}

export interface PayungProgramState {
  settings: PayungProgramSettings;
  rewards: ManagedPayungReward[];
}

export const PAYUNG_STORAGE_KEY = "tcc-demo-payung-v1";
export const PAYUNG_PROGRAM_EVENT = "tcc:payung-program";

const now = "2026-10-19T00:00:00+08:00";
export const DEFAULT_PAYUNG_STATE: PayungProgramState = {
  settings: { pointsPerRM: 3, joinBonus: 25 },
  rewards: payungRewards.map((reward) => ({ ...reward, status: "active", createdAt: now, updatedAt: now })),
};

function browserReady() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeReward(raw: Partial<ManagedPayungReward>, fallback?: ManagedPayungReward): ManagedPayungReward | null {
  const base = fallback ?? DEFAULT_PAYUNG_STATE.rewards.find((item) => item.id === raw.id || item.slug === raw.slug);
  const merged = { ...base, ...raw } as Partial<ManagedPayungReward>;
  if (!merged.id || !merged.slug || !merged.name || typeof merged.points !== "number") return null;
  return {
    id: merged.id,
    slug: merged.slug,
    name: merged.name,
    points: Math.max(0, Math.round(merged.points)),
    note: merged.note ?? "",
    description: merged.description ?? "",
    image: merged.image ?? "",
    gallery: Array.isArray(merged.gallery) ? merged.gallery.filter(Boolean) : [],
    shippingRequired: merged.shippingRequired !== false,
    category: merged.category ?? "Reward",
    variants: Array.isArray(merged.variants) ? merged.variants : [],
    details: Array.isArray(merged.details) ? merged.details : [],
    status: merged.status === "draft" || merged.status === "archived" ? merged.status : "active",
    createdAt: merged.createdAt ?? new Date().toISOString(),
    updatedAt: merged.updatedAt ?? new Date().toISOString(),
  };
}

export function readPayungProgramState(): PayungProgramState {
  if (!browserReady()) return structuredClone(DEFAULT_PAYUNG_STATE);
  try {
    const raw = window.localStorage.getItem(PAYUNG_STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_PAYUNG_STATE);
    const parsed = JSON.parse(raw) as Partial<PayungProgramState>;
    const rewards = Array.isArray(parsed.rewards)
      ? parsed.rewards.map((reward) => normalizeReward(reward)).filter((reward): reward is ManagedPayungReward => Boolean(reward))
      : structuredClone(DEFAULT_PAYUNG_STATE.rewards);
    return {
      settings: {
        pointsPerRM: Math.max(0, Number(parsed.settings?.pointsPerRM ?? DEFAULT_PAYUNG_STATE.settings.pointsPerRM)),
        joinBonus: Math.max(0, Math.round(Number(parsed.settings?.joinBonus ?? DEFAULT_PAYUNG_STATE.settings.joinBonus))),
      },
      rewards,
    };
  } catch {
    return structuredClone(DEFAULT_PAYUNG_STATE);
  }
}

export function writePayungProgramState(state: PayungProgramState) {
  if (!browserReady()) return;
  window.localStorage.setItem(PAYUNG_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<PayungProgramState>(PAYUNG_PROGRAM_EVENT, { detail: state }));
}

export function getActivePayungRewards(state = readPayungProgramState()) {
  return state.rewards.filter((reward) => reward.status === "active");
}

export function getManagedPayungReward(slug: string, state = readPayungProgramState()) {
  return state.rewards.find((reward) => reward.slug === slug) ?? null;
}

export function saveManagedPayungReward(reward: ManagedPayungReward) {
  const state = readPayungProgramState();
  const updated = { ...reward, updatedAt: new Date().toISOString() };
  writePayungProgramState({ ...state, rewards: [...state.rewards.filter((item) => item.id !== reward.id), updated] });
  return updated;
}

export function deleteManagedPayungReward(rewardId: string) {
  const state = readPayungProgramState();
  writePayungProgramState({ ...state, rewards: state.rewards.filter((item) => item.id !== rewardId) });
}

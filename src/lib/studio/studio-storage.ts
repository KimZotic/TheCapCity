import { DEMO_STOREFRONT_SETTINGS } from "@/lib/demo/storefront-settings";
import type { StudioSettings } from "@/lib/studio/contracts";

export const STUDIO_STORAGE_KEY = "tcc-demo-studio-v1";
export const STUDIO_SETTINGS_EVENT = "tcc:studio-settings";

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  announcement: {
    enabled: DEMO_STOREFRONT_SETTINGS.announcement.enabled,
    message: DEMO_STOREFRONT_SETTINGS.announcement.message,
    href: DEMO_STOREFRONT_SETTINGS.announcement.href,
    startsAt: "",
    endsAt: "",
  },
};

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStudioSettings(): StudioSettings {
  if (!hasBrowserStorage()) return structuredClone(DEFAULT_STUDIO_SETTINGS);
  try {
    const raw = window.localStorage.getItem(STUDIO_STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STUDIO_SETTINGS);
    const parsed = JSON.parse(raw) as Partial<StudioSettings>;
    const announcement = parsed.announcement;
    return {
      announcement: {
        enabled: typeof announcement?.enabled === "boolean" ? announcement.enabled : DEFAULT_STUDIO_SETTINGS.announcement.enabled,
        message: typeof announcement?.message === "string" ? announcement.message : DEFAULT_STUDIO_SETTINGS.announcement.message,
        href: typeof announcement?.href === "string" ? announcement.href : DEFAULT_STUDIO_SETTINGS.announcement.href,
        startsAt: typeof announcement?.startsAt === "string" ? announcement.startsAt : "",
        endsAt: typeof announcement?.endsAt === "string" ? announcement.endsAt : "",
      },
    };
  } catch {
    return structuredClone(DEFAULT_STUDIO_SETTINGS);
  }
}

export function writeStudioSettings(settings: StudioSettings) {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent<StudioSettings>(STUDIO_SETTINGS_EVENT, { detail: settings }));
}

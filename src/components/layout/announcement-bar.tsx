"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StudioSettings } from "@/lib/studio/contracts";
import { DEFAULT_STUDIO_SETTINGS, readStudioSettings, STUDIO_SETTINGS_EVENT } from "@/lib/studio/studio-storage";

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(DEFAULT_STUDIO_SETTINGS.announcement);

  useEffect(() => {
    setAnnouncement(readStudioSettings().announcement);
    const onStudioSettings = (event: Event) => {
      const detail = (event as CustomEvent<StudioSettings>).detail;
      setAnnouncement(detail?.announcement ?? readStudioSettings().announcement);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "tcc-demo-studio-v1") setAnnouncement(readStudioSettings().announcement);
    };
    window.addEventListener(STUDIO_SETTINGS_EVENT, onStudioSettings as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STUDIO_SETTINGS_EVENT, onStudioSettings as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const now = Date.now();
  const startsOk = !announcement.startsAt || now >= new Date(announcement.startsAt).getTime();
  const endsOk = !announcement.endsAt || now <= new Date(announcement.endsAt).getTime();
  if (!announcement.enabled || !announcement.message.trim() || !startsOk || !endsOk) return null;
  return (
    <div className="relative overflow-hidden border-b border-white/[.08] bg-[#111216] px-4 py-2 text-center text-white">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[420px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(215,255,87,.10),transparent_68%)]"/>
      <Link href={announcement.href} className="relative inline-flex items-center gap-2 text-[8px] font-semibold tracking-[.025em] text-white/72 transition hover:text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#d7ff57] tcc-pulse-dot"/><span>{announcement.message}</span><span className="text-white/35">↗</span></Link>
    </div>
  );
}

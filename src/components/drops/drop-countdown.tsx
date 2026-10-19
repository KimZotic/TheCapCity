"use client";

import { useEffect, useMemo, useState } from "react";
function remaining(target: number) { const distance = Math.max(0, target - Date.now()); const totalSeconds = Math.floor(distance / 1000); return { distance, days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 }; }
export function DropCountdown({ releaseAt }: { releaseAt: string }) {
  const target = useMemo(() => new Date(releaseAt).getTime(), [releaseAt]);
  const [time, setTime] = useState(() => remaining(target));
  useEffect(() => { const update = () => setTime(remaining(target)); update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer); }, [target]);
  if (!Number.isFinite(target) || time.distance <= 0) return <div className="inline-flex items-center gap-2 rounded-[11px_4px_11px_4px] bg-[#d7ff57] px-3 py-2 text-[9px] font-bold text-black"><span className="h-1.5 w-1.5 rounded-full bg-black tcc-pulse-dot"/>Live now</div>;
  return <div className="grid grid-cols-4 gap-1.5" aria-label="Countdown to release">{[["Days", time.days],["Hours", time.hours],["Min", time.minutes],["Sec", time.seconds]].map(([label,value]) => <div key={label} className="rounded-[12px_4px_12px_4px] border border-white/10 bg-black/35 px-2 py-2.5 text-center backdrop-blur"><strong className="block text-[14px] font-bold tracking-[-.03em] text-white sm:text-[16px]">{String(value).padStart(2,"0")}</strong><span className="mt-1 block text-[7px] font-bold uppercase tracking-[.08em] text-white/35">{label}</span></div>)}</div>;
}

import Link from "next/link";
import type { DropSummary } from "@/lib/commerce/contracts";

const statusLabel: Record<DropSummary["status"], string> = { live: "Live", upcoming: "Upcoming", restock: "Restock" };
function formatRelease(value: string) { return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(value)); }

export function DropCard({ drop }: { drop: DropSummary }) {
  return (
    <Link href={`/drops/${drop.slug}`} className="group relative block min-h-[280px] overflow-hidden rounded-[22px_22px_8px_22px] bg-[#121317] text-white sm:min-h-[320px]">
      {drop.image && <img src={drop.image} alt={drop.title} className="absolute inset-0 h-full w-full object-cover opacity-68 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-82"/>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/8"/>
      <div className="absolute left-4 top-4 flex items-center gap-2 text-[8px] font-semibold text-white/66"><span className={`h-1.5 w-1.5 rounded-full ${drop.status === "live" ? "bg-[#d7ff57]" : "bg-white/55"}`}/>{statusLabel[drop.status]} · {formatRelease(drop.releaseAt)}</div>
      <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5"><div className="flex items-end justify-between gap-4"><div><h2 className="font-display max-w-[15ch] text-[1.7rem] leading-[1] sm:text-[1.95rem]">{drop.title}</h2><p className="mt-2 line-clamp-2 max-w-[44ch] text-[9px] leading-4 text-white/50">{drop.description}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/24 bg-black/25 text-[13px] backdrop-blur transition group-hover:bg-white group-hover:text-black">↗</span></div></div>
    </Link>
  );
}

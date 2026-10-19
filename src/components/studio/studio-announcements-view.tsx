"use client";

import { useEffect, useState } from "react";
import { useStudio } from "@/components/studio/studio-provider";

export function StudioAnnouncementsView() {
  const { settings, updateAnnouncement } = useStudio();
  const [enabled,setEnabled]=useState(settings.announcement.enabled);
  const [message,setMessage]=useState(settings.announcement.message);
  const [href,setHref]=useState(settings.announcement.href);
  const [startsAt,setStartsAt]=useState(settings.announcement.startsAt??"");
  const [endsAt,setEndsAt]=useState(settings.announcement.endsAt??"");
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setEnabled(settings.announcement.enabled);setMessage(settings.announcement.message);setHref(settings.announcement.href);setStartsAt(settings.announcement.startsAt??"");setEndsAt(settings.announcement.endsAt??"");},[settings]);
  const save=()=>{const raw=href.trim();const destination=raw?(/^https?:\/\//i.test(raw)?raw:new URL(raw.startsWith("/")?raw:`/${raw}`,window.location.origin).href):window.location.origin;updateAnnouncement({enabled,message:message.trim(),href:destination,startsAt,endsAt});setHref(destination);setSaved(true);window.setTimeout(()=>setSaved(false),1200);};
  const scheduled=Boolean(startsAt||endsAt);
  return <div className="studio-page studio-page-flush"><div className="grid gap-3 lg:grid-cols-[1fr_.72fr]">
    <section className="studio-card p-5"><div className="flex items-center justify-between border-b border-black/[.07] pb-4"><div><p className="text-[11px] font-bold">Announcement bar</p><p className="mt-1 text-[7px] text-black/32">{enabled?scheduled?"Scheduled / enabled":"Enabled":"Hidden"}</p></div><button type="button" onClick={()=>setEnabled((value)=>!value)} className={`relative h-7 w-12 rounded-full transition ${enabled?"bg-black":"bg-black/12"}`} aria-pressed={enabled}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled?"left-6":"left-1"}`}/></button></div>
      <div className="mt-5 grid gap-4"><label><span className="studio-field-label">Message</span><input value={message} onChange={(event)=>setMessage(event.target.value)} maxLength={110} className="studio-input"/></label><label><span className="studio-field-label">Destination link</span><input value={href} onChange={(event)=>setHref(event.target.value)} className="studio-input" placeholder="https://thecapcity.com/collections/..." inputMode="url"/></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="studio-field-label">Starts</span><input type="datetime-local" value={startsAt} onChange={(e)=>setStartsAt(e.target.value)} className="studio-input"/></label><label><span className="studio-field-label">Ends</span><input type="datetime-local" value={endsAt} onChange={(e)=>setEndsAt(e.target.value)} className="studio-input"/></label></div></div>
      <div className="mt-5 flex items-center justify-between border-t border-black/[.07] pt-4"><span className="text-[7px] text-black/30">{message.length}/110</span><button onClick={save} disabled={!message.trim()} className="studio-button disabled:opacity-35">{saved?"Saved ✓":"Publish update"}</button></div>
    </section>
    <aside className="studio-card overflow-hidden bg-[#111216] p-5 text-white"><p className="text-[9px] font-bold">Storefront preview</p><div className="mt-4 overflow-hidden rounded-[14px] border border-white/10 bg-[#09090a]"><div className="relative overflow-hidden border-b border-white/[.08] px-4 py-2.5 text-center"><div className="pointer-events-none absolute inset-y-0 left-1/2 w-[300px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(215,255,87,.12),transparent_68%)]"/><div className="relative inline-flex items-center gap-2 text-[8px] font-semibold text-white/72"><span className={`h-1.5 w-1.5 rounded-full ${enabled?"bg-[#d7ff57]":"bg-white/20"}`}/><span>{enabled&&message?message:"Announcement hidden"}</span>{enabled&&<span className="text-white/35">↗</span>}</div></div><div className="grid h-32 place-items-center text-[8px] text-white/18">Storefront header</div></div><div className="mt-4 grid grid-cols-2 gap-2 text-[7px]"><div className="rounded-[10px] bg-white/[.05] p-3"><p className="text-white/30">START</p><p className="mt-1 font-semibold text-white/65">{startsAt||"Immediately"}</p></div><div className="rounded-[10px] bg-white/[.05] p-3"><p className="text-white/30">END</p><p className="mt-1 font-semibold text-white/65">{endsAt||"No end"}</p></div></div></aside>
  </div></div>;
}

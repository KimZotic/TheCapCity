"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { SUPPORT_EVENT, SUPPORT_STORAGE_KEY, createInitialSupportState, createMessage } from "@/lib/support/support-service";
import type { SupportState } from "@/lib/support/contracts";
import { listDemoOrders } from "@/lib/services/demo-order-service";
import { StudioIcon } from "@/components/studio/studio-icons";

const STATUS_KEY="tcc-demo-support-studio-v1";

export function StudioSupportView(){
  const [thread,setThread]=useState<SupportState>(createInitialSupportState());
  const [status,setStatus]=useState<"open"|"resolved">("open");
  const [draft,setDraft]=useState("");
  useEffect(()=>{
    const sync=()=>{try{const raw=localStorage.getItem(SUPPORT_STORAGE_KEY);if(raw)setThread(JSON.parse(raw));const saved=localStorage.getItem(STATUS_KEY);if(saved==="open"||saved==="resolved")setStatus(saved);}catch{}};
    sync(); window.addEventListener(SUPPORT_EVENT,sync as EventListener); window.addEventListener("storage",sync);
    return()=>{window.removeEventListener(SUPPORT_EVENT,sync as EventListener);window.removeEventListener("storage",sync);};
  },[]);
  const orders=useMemo(()=>listDemoOrders().slice(0,8),[thread.updatedAt]);
  const send=(event:FormEvent)=>{event.preventDefault();const text=draft.trim();if(!text)return;const next={...thread,updatedAt:new Date().toISOString(),messages:[...thread.messages,createMessage("agent",text)]};setThread(next);setDraft("");localStorage.setItem(SUPPORT_STORAGE_KEY,JSON.stringify(next));window.dispatchEvent(new CustomEvent(SUPPORT_EVENT,{detail:next}));};
  const changeStatus=(next:"open"|"resolved")=>{setStatus(next);localStorage.setItem(STATUS_KEY,next);};
  const lastCustomerMessage=[...thread.messages].reverse().find((message)=>message.author==="customer");

  return <div className="studio-page studio-page-flush">
    <div className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="studio-card studio-list-frame">
        <div className="border-b border-black/[.07] p-3"><div className="flex items-center justify-between"><p className="text-[9px] font-bold">Inbox</p><span className="rounded-full bg-[#edf7e7] px-2 py-1 text-[6px] font-bold text-[#4d8139]">1 thread</span></div></div>
        <div className="studio-list-scroll p-2">
          <button className="w-full rounded-[12px] border border-black/[.08] bg-[#f0f4ea] p-3 text-left">
            <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${status==="open"?"bg-[#6da54e]":"bg-black/20"}`}/><p className="text-[8px] font-bold">Storefront live chat</p></div>
            <p className="mt-2 line-clamp-2 text-[7px] leading-4 text-black/42">{lastCustomerMessage?.text??"Waiting for a customer reply."}</p>
            <div className="mt-3 flex items-center justify-between"><span className="text-[6px] font-semibold capitalize text-black/32">{thread.topic??"general"}</span><span className="text-[6px] text-black/28">{new Date(thread.updatedAt).toLocaleTimeString("en-MY",{hour:"2-digit",minute:"2-digit"})}</span></div>
          </button>
        </div>
      </aside>

      <section className="studio-card studio-list-frame">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[.07] p-3.5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white"><StudioIcon name="support" className="h-4 w-4"/></span><div><p className="text-[9px] font-bold">Live chat</p><p className="mt-1 text-[6px] capitalize text-black/32">{thread.topic??"General"} · {thread.messages.length} messages</p></div></div><button onClick={()=>changeStatus(status==="open"?"resolved":"open")} className={status==="open"?"studio-button-secondary":"studio-button"}>{status==="open"?"Resolve":"Reopen"}</button></header>
        <div className="studio-list-scroll bg-[#f7f7f3] p-4"><div className="mx-auto max-w-[760px] space-y-3">{thread.messages.map((message)=><div key={message.id} className={`flex ${message.author==="agent"?"justify-end":"justify-start"}`}><div className={`max-w-[78%] rounded-[15px_15px_5px_15px] px-3.5 py-3 shadow-[0_1px_0_rgba(0,0,0,.04)] ${message.author==="agent"?"bg-[#121317] text-white":"border border-black/[.07] bg-white text-black"}`}><p className={`text-[8px] leading-[1.55] ${message.author==="agent"?"text-white/80":"text-black/68"}`}>{message.text}</p><p className={`mt-2 text-[6px] ${message.author==="agent"?"text-white/32":"text-black/28"}`}>{message.author==="agent"?"TCC Support":"Customer"} · {new Date(message.createdAt).toLocaleTimeString("en-MY",{hour:"2-digit",minute:"2-digit"})}</p></div></div>)}</div></div>
        <form onSubmit={send} className="border-t border-black/[.07] p-3"><div className="flex gap-2 rounded-[13px] border border-black/[.09] bg-white p-1.5"><input value={draft} onChange={(event)=>setDraft(event.target.value)} placeholder="Reply to customer" className="min-w-0 flex-1 bg-transparent px-2 text-[8px] font-semibold outline-none placeholder:text-black/25"/><button disabled={!draft.trim()} className="studio-button disabled:opacity-30">Send</button></div></form>
      </section>

      <aside className="self-start space-y-3">
        <section className="studio-card p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold">Conversation</p><span className={`rounded-full px-2 py-1 text-[6px] font-bold ${status==="open"?"bg-[#e9f5e4] text-[#4b8038]":"bg-black/[.05] text-black/36"}`}>{status}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><ContextStat label="Topic" value={thread.topic??"General"}/><ContextStat label="Updated" value={new Date(thread.updatedAt).toLocaleDateString("en-MY",{day:"numeric",month:"short"})}/></div></section>
        <section className="studio-card overflow-hidden"><div className="flex items-center justify-between border-b border-black/[.07] p-3"><p className="text-[9px] font-bold">Recent customer orders</p><Link href="/studio/orders" className="text-[6px] font-bold text-black/38">Open Orders ↗</Link></div><div className="tcc-scroll max-h-[360px] overflow-y-auto">{orders.length?orders.map((order)=><Link key={order.id} href="/studio/orders" className="block border-b border-black/[.05] p-3 last:border-0 hover:bg-black/[.018]"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[8px] font-bold">{order.reference}</p><p className="mt-1 truncate text-[6px] text-black/32">{order.contact.firstName} {order.contact.lastName} · {order.contact.email}</p></div><span className="shrink-0 rounded-full bg-black/[.05] px-2 py-1 text-[6px] font-bold capitalize">{order.status.replaceAll("-"," ")}</span></div></Link>):<div className="grid min-h-40 place-items-center text-[7px] text-black/30">No recent orders.</div>}</div></section>
      </aside>
    </div>
  </div>;
}

function ContextStat({label,value}:{label:string;value:string}){return <div className="rounded-[11px] bg-[#f6f6f2] p-3"><p className="text-[6px] font-bold uppercase tracking-[.08em] text-black/28">{label}</p><p className="mt-2 truncate text-[8px] font-bold capitalize">{value}</p></div>}

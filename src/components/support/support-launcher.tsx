"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowIcon, ChatIcon, CloseIcon } from "@/components/icons";
import type { SupportState, SupportTopic } from "@/lib/support/contracts";
import { createInitialSupportState, createMessage, demoAgentReply, SUPPORT_EVENT, SUPPORT_STORAGE_KEY, topicPrompt } from "@/lib/support/support-service";

const topics: { id: SupportTopic; label: string }[] = [
  { id: "order", label: "Order" },
  { id: "product", label: "Product & sizing" },
  { id: "pickup", label: "Pickup" },
  { id: "payung", label: "Payung Program" }
];

function time(value: string) {
  return new Intl.DateTimeFormat("en-MY", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function SupportLauncher() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<SupportState>(() => createInitialSupportState());
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const [launcherPosition, setLauncherPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SUPPORT_STORAGE_KEY); if (saved) setState(JSON.parse(saved) as SupportState);
      const position = window.localStorage.getItem("tcc-live-chat-position-v1"); if (position) setLauncherPosition(JSON.parse(position));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (!hydrated) return; try { window.localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(state)); window.dispatchEvent(new CustomEvent(SUPPORT_EVENT,{detail:state})); } catch {} }, [hydrated, state]);
  useEffect(() => {
    function handleOpen(event: Event) { const custom = event as CustomEvent<{ topic?: SupportTopic }>; setOpen(true); if (custom.detail?.topic) chooseTopic(custom.detail.topic, false); }
    function handleKey(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    function handleSync(event: Event) { const detail=(event as CustomEvent<SupportState>).detail; if(detail) setState(detail); else { try { const raw=window.localStorage.getItem(SUPPORT_STORAGE_KEY); if(raw) setState(JSON.parse(raw) as SupportState); } catch {} } }
    window.addEventListener("tcc:open-support", handleOpen); window.addEventListener("keydown", handleKey); window.addEventListener(SUPPORT_EVENT, handleSync as EventListener);
    return () => { window.removeEventListener("tcc:open-support", handleOpen); window.removeEventListener("keydown", handleKey); window.removeEventListener(SUPPORT_EVENT, handleSync as EventListener); if (replyTimer.current) clearTimeout(replyTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => { scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" }); inputRef.current?.focus({ preventScroll: true }); });
  }, [open, state.messages, typing]);


  function clampLauncher(x: number, y: number) {
    const width = launcherRef.current?.offsetWidth ?? 92;
    const height = launcherRef.current?.offsetHeight ?? 46;
    return { x: Math.max(8, Math.min(x, window.innerWidth - width - 8)), y: Math.max(72, Math.min(y, window.innerHeight - height - 8)) };
  }
  function startDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (open) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: rect.left, originY: rect.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current; if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX; const dy = event.clientY - drag.startY;
    if (Math.hypot(dx,dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    setLauncherPosition(clampLauncher(drag.originX + dx, drag.originY + dy));
  }
  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current; if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      const next = launcherPosition ?? clampLauncher(drag.originX + event.clientX - drag.startX, drag.originY + event.clientY - drag.startY);
      try { window.localStorage.setItem("tcc-live-chat-position-v1", JSON.stringify(next)); } catch {}
    } else setOpen(true);
    dragRef.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  }

  function chooseTopic(topic: SupportTopic, shouldFocus = true) {
    setState((current) => ({ ...current, topic, updatedAt: new Date().toISOString(), messages: [...current.messages, createMessage("agent", topicPrompt(topic))] }));
    if (shouldFocus) requestAnimationFrame(() => inputRef.current?.focus());
  }
  function send(text: string) {
    const clean = text.trim(); if (!clean || typing) return;
    setDraft(""); setState((current) => ({ ...current, updatedAt: new Date().toISOString(), messages: [...current.messages, createMessage("customer", clean)] })); setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => { setState((current) => ({ ...current, updatedAt: new Date().toISOString(), messages: [...current.messages, createMessage("agent", demoAgentReply(clean, current.topic))] })); setTyping(false); }, 520);
  }
  function submit(event: FormEvent) { event.preventDefault(); send(draft); }
  function reset() { setState(createInitialSupportState()); setDraft(""); setTyping(false); if (replyTimer.current) clearTimeout(replyTimer.current); }

  return <>
    <button ref={launcherRef} type="button" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={() => { dragRef.current = null; }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setOpen(true); }} style={launcherPosition ? { left: launcherPosition.x, top: launcherPosition.y, right: "auto", bottom: "auto", touchAction: "none" } : { touchAction: "none" }} aria-label="Open or move TCC live chat" aria-expanded={open} className={`tcc-live-chat-launcher fixed bottom-3 right-2 z-[105] min-[390px]:right-3 sm:bottom-5 sm:right-5 ${open ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"}`}>
      <span className="relative grid h-7 w-7 place-items-center rounded-full bg-black text-white"><ChatIcon className="h-3.5 w-3.5"/><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#f4f2ec] bg-[#d7ff57]"/></span><span className="hidden min-[370px]:inline">Live chat</span><span className="grid h-5 w-3 place-items-center text-[10px] leading-none text-black/24" aria-hidden="true">⋮</span>
    </button>

    {open && <aside role="dialog" aria-label="The Cap City live chat" className="fixed bottom-3 right-2 z-[110] flex max-h-[74dvh] w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[22px_22px_8px_22px] border border-black/10 bg-[#f4f2ec] text-[#111216] shadow-[0_30px_95px_rgba(0,0,0,.38)] min-[390px]:right-3 min-[390px]:w-[min(380px,calc(100vw-24px))] sm:bottom-5 sm:right-5 sm:max-h-[640px]">
      <div className="flex shrink-0 items-center justify-between bg-[#111216] px-4 py-3.5 text-white">
        <div><div className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d7ff57] opacity-40"/><span className="relative h-2 w-2 rounded-full bg-[#d7ff57]"/></span><p className="text-[11px] font-bold">TCC Live Chat</p></div><p className="mt-1 text-[7px] text-white/35">Demo support · conversation saved in this browser</p></div>
        <div className="flex items-center gap-1"><button type="button" onClick={reset} className="rounded-lg px-2 py-2 text-[7px] font-semibold text-white/35 hover:bg-white/[.07] hover:text-white">Clear</button><button type="button" onClick={() => setOpen(false)} aria-label="Close live chat" className="grid h-8 w-8 place-items-center rounded-[10px_10px_3px_10px] border border-white/12 text-white/60 hover:bg-white/[.08] hover:text-white"><CloseIcon className="h-3.5 w-3.5"/></button></div>
      </div>

      <div className="shrink-0 border-b border-black/[.08] px-3 py-2.5"><div className="tcc-scroll flex gap-1.5 overflow-x-auto">{topics.map((topic) => <button key={topic.id} type="button" onClick={() => chooseTopic(topic.id)} className={`shrink-0 rounded-full border px-3 py-2 text-[7px] font-bold transition ${state.topic === topic.id ? "border-black bg-black text-white" : "border-black/[.09] bg-white/70 text-black/48 hover:border-black/20 hover:text-black"}`}>{topic.label}</button>)}</div></div>

      <div ref={scrollerRef} className="tcc-scroll min-h-[210px] flex-1 overflow-y-auto px-3 py-4"><div className="space-y-3">{state.messages.map((message) => <div key={message.id} className={`flex ${message.author === "customer" ? "justify-end" : "justify-start"}`}><div className={`max-w-[86%] rounded-[15px_15px_5px_15px] px-3 py-2.5 shadow-sm ${message.author === "customer" ? "bg-black text-white" : "border border-black/[.07] bg-white text-black"}`}><p className={`text-[8px] leading-[1.55] ${message.author === "agent" ? "text-black/64" : "text-white/78"}`}>{message.text}</p><p className={`mt-1.5 text-[6px] ${message.author === "agent" ? "text-black/28" : "text-white/28"}`}>{message.author === "agent" ? "TCC support" : "You"} · {time(message.createdAt)}</p></div></div>)}{typing && <div className="flex justify-start"><div className="flex h-8 items-center gap-1 rounded-[12px_12px_4px_12px] border border-black/[.07] bg-white px-3"><span className="tcc-pulse-dot h-1 w-1 rounded-full bg-black/35"/><span className="tcc-pulse-dot h-1 w-1 rounded-full bg-black/35 [animation-delay:120ms]"/><span className="tcc-pulse-dot h-1 w-1 rounded-full bg-black/35 [animation-delay:240ms]"/></div></div>}</div></div>

      <div className="shrink-0 border-t border-black/[.08] bg-[#ebe9e2] p-3"><div className="mb-2 flex items-center gap-3 text-[7px] font-semibold text-black/32"><Link href="/tracking" onClick={() => setOpen(false)} className="hover:text-black">Track order</Link><Link href="/account" onClick={() => setOpen(false)} className="hover:text-black">Account</Link><Link href="/payung" onClick={() => setOpen(false)} className="hover:text-black">Payung Program</Link></div><form onSubmit={submit} className="flex items-center gap-2 rounded-[14px_14px_5px_14px] border border-black/[.10] bg-white p-1.5 shadow-sm focus-within:border-black/25"><input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message TCC support" className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[9px] font-semibold text-black outline-none placeholder:text-black/30"/><button type="submit" disabled={!draft.trim() || typing} aria-label="Send message" className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px_10px_3px_10px] bg-black text-white transition hover:scale-[1.02] disabled:bg-black/10 disabled:text-black/20"><ArrowIcon className="h-3.5 w-3.5"/></button></form></div>
    </aside>}
  </>;
}

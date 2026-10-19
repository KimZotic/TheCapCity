"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

export interface SelectOption<T extends string = string> { value: T; label: string; }

function Chevron({ open }: { open: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none"><path d="m6.5 8.25 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function CustomSelect<T extends string>({ value, onChange, options, label }: { value: T; onChange: (value: T) => void; options: readonly SelectOption<T>[]; label: string }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.findIndex((item) => item.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((item) => item.value === value);

  useEffect(() => {
    function close(event: MouseEvent) { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); }
    function key(event: globalThis.KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close); window.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", close); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => { const next = options.findIndex((item) => item.value === value); if (next >= 0) setActiveIndex(next); }, [options, value]);

  function commit(index: number) { const option = options[index]; if (!option) return; onChange(option.value); setOpen(false); }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (!open) { setOpen(true); return; } const delta = event.key === "ArrowDown" ? 1 : -1; setActiveIndex((index) => (index + delta + options.length) % options.length); return; }
    if (event.key === "Home" && open) { event.preventDefault(); setActiveIndex(0); return; }
    if (event.key === "End" && open) { event.preventDefault(); setActiveIndex(Math.max(0, options.length - 1)); return; }
    if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); commit(activeIndex); }
  }

  return <div ref={rootRef} className="relative min-w-[132px]">
    <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={label} onKeyDown={onKeyDown} onClick={() => setOpen((state) => !state)} className={`tcc-sort-trigger ${open ? "is-open" : ""}`}><span>{current?.label ?? label}</span><span className="text-white/40"><Chevron open={open}/></span></button>
    {open && <div role="listbox" aria-label={label} className="tcc-sort-menu absolute right-0 z-40 mt-2 min-w-[184px] overflow-hidden rounded-[14px_14px_5px_14px] border border-white/10 bg-[#141519] p-1.5 shadow-[0_22px_56px_rgba(0,0,0,.45)]">{options.map((option,index) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onMouseEnter={() => setActiveIndex(index)} onClick={() => commit(index)} className={`flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[9px] font-semibold transition ${option.value === value ? "bg-white text-black" : index === activeIndex ? "bg-white/[.07] text-white" : "text-white/58 hover:text-white"}`}><span>{option.label}</span>{option.value === value && <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-[8px] text-white">✓</span>}</button>)}</div>}
  </div>;
}

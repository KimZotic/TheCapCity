"use client";

import { useEffect, useRef, useState } from "react";

export interface StudioSelectOption<T extends string = string>{ value:T; label:string; }

export function StudioSelect<T extends string>({value,onChange,options,label}:{value:T;onChange:(value:T)=>void;options:readonly StudioSelectOption<T>[];label:string}){
  const [open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const current=options.find((item)=>item.value===value);
  useEffect(()=>{function close(event:MouseEvent){if(!root.current?.contains(event.target as Node))setOpen(false)}function key(event:KeyboardEvent){if(event.key==="Escape")setOpen(false)}document.addEventListener("mousedown",close);window.addEventListener("keydown",key);return()=>{document.removeEventListener("mousedown",close);window.removeEventListener("keydown",key)}},[]);
  return <div ref={root} className="relative"><button type="button" onClick={()=>setOpen((v)=>!v)} aria-expanded={open} aria-haspopup="listbox" className="studio-select-trigger"><span>{current?.label??label}</span><svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition ${open?"rotate-180":""}`} fill="none"><path d="m6.5 8.25 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>{open&&<div role="listbox" aria-label={label} className="studio-select-menu">{options.map((option)=><button key={option.value} type="button" role="option" aria-selected={option.value===value} onClick={()=>{onChange(option.value);setOpen(false)}} className={`studio-select-option ${option.value===value?"is-active":""}`}><span>{option.label}</span>{option.value===value&&<span>✓</span>}</button>)}</div>}</div>
}

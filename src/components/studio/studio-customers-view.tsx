"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { StudioIcon } from "@/components/studio/studio-icons";
import { getPayungTier } from "@/lib/account/payung-data";
import { CUSTOMER_DIRECTORY_EVENT, readCustomerDirectory, saveCustomerNote, type CustomerDirectoryEntry } from "@/lib/account/customer-storage";
import { listDemoOrders } from "@/lib/services/demo-order-service";
import type { DemoOrder } from "@/lib/commerce/contracts";

function money(value:number){return `RM ${value.toLocaleString("en-MY",{maximumFractionDigits:2})}`}
function date(value?:string){if(!value)return"—";return new Intl.DateTimeFormat("en-MY",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value))}

export function StudioCustomersView(){
  const [customers,setCustomers]=useState<CustomerDirectoryEntry[]>([]);
  const [query,setQuery]=useState("");
  const [tierFilter,setTierFilter]=useState("all");
  const [selectedId,setSelectedId]=useState("");
  const [note,setNote]=useState("");
  const [saved,setSaved]=useState(false);
  const [ordersOpen,setOrdersOpen]=useState(false);

  function refresh(){const next=readCustomerDirectory();setCustomers(next);setSelectedId(current=>current&&next.some(item=>item.id===current)?current:next[0]?.id??"");}
  useEffect(()=>{refresh();const onChange=()=>refresh();window.addEventListener(CUSTOMER_DIRECTORY_EVENT,onChange);window.addEventListener("storage",onChange);return()=>{window.removeEventListener(CUSTOMER_DIRECTORY_EVENT,onChange);window.removeEventListener("storage",onChange);};},[]);
  const orders=useMemo(()=>listDemoOrders(),[customers]);
  const filtered=useMemo(()=>{const term=query.trim().toLowerCase();return customers.filter(customer=>{const tier=getPayungTier(customer.lifetimeSpend).id;return(tierFilter==="all"||tier===tierFilter)&&(!term||`${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone}`.toLowerCase().includes(term));});},[customers,query,tierFilter]);
  const selected=customers.find(customer=>customer.id===selectedId)??null;
  const customerOrders=selected?orders.filter(order=>order.contact.email.toLowerCase()===selected.email.toLowerCase()):[];
  const repeat=customers.filter(customer=>orders.filter(order=>order.contact.email.toLowerCase()===customer.email.toLowerCase()).length>1).length;
  useEffect(()=>{setNote(selected?.note??"");setSaved(false);setOrdersOpen(false);},[selectedId]);
  function saveNote(){if(!selected)return;saveCustomerNote(selected.id,note.trim());setSaved(true);window.setTimeout(()=>setSaved(false),1000);refresh();}

  return <div className="studio-page studio-page-flush">
    <section className="mb-3 grid gap-2 sm:grid-cols-3"><CompactMetric icon="customers" label="Customers" value={customers.length}/><CompactMetric icon="orders" label="Linked orders" value={orders.length}/><CompactMetric icon="ranking" label="Repeat customers" value={repeat}/></section>
    <section className="studio-workspace-height grid gap-3 xl:grid-cols-[minmax(0,1.08fr)_minmax(370px,.92fr)] xl:items-stretch">
      <div className="studio-card flex min-h-0 flex-col overflow-hidden">
        <div className="studio-toolbar"><label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[11px] border border-black/10 bg-[#f7f7f3] px-3"><SearchIcon className="h-3.5 w-3.5 text-black/35"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or phone" className="min-w-0 flex-1 bg-transparent text-[9px] font-semibold outline-none placeholder:text-black/25"/></label><div className="tcc-scroll flex gap-1 overflow-x-auto">{[["all","All"],["black-cup","Black"],["silver-cup","Silver"],["gold-cup","Gold"],["crown","Crown"]].map(([id,label])=><button key={id} onClick={()=>setTierFilter(id)} className={`min-h-9 shrink-0 rounded-[9px] px-3 text-[7px] font-bold ${tierFilter===id?"bg-black text-white":"border border-black/8 bg-white text-black/48"}`}>{label}</button>)}</div></div>
        <div className="tcc-scroll min-h-0 flex-1 overflow-y-auto">{filtered.map(customer=>{const tier=getPayungTier(customer.lifetimeSpend);const count=orders.filter(order=>order.contact.email.toLowerCase()===customer.email.toLowerCase()).length;const active=customer.id===selectedId;return <button key={customer.id} onClick={()=>setSelectedId(customer.id)} className={`grid w-full grid-cols-[minmax(0,1fr)_92px_68px] items-center gap-3 border-b border-black/[.06] px-4 py-3 text-left ${active?"bg-[#f0f5e8]":"hover:bg-black/[.018]"}`}><div className="flex min-w-0 items-center gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[8px] font-extrabold ${active?"bg-black text-white":"bg-black/[.055] text-black/58"}`}>{customer.firstName[0]}{customer.lastName[0]}</span><div className="min-w-0"><p className="truncate text-[9px] font-bold">{customer.firstName} {customer.lastName}</p><p className="mt-1 truncate text-[6px] text-black/34">{customer.email}</p></div></div><div><p className="text-[7px] font-bold">{tier.name}</p><p className="mt-1 text-[6px] text-black/30">{money(customer.lifetimeSpend)}</p></div><div className="text-right"><p className="text-[8px] font-bold">{count}</p><p className="mt-1 text-[6px] text-black/30">orders</p></div></button>})}{!filtered.length&&<div className="grid h-full min-h-[360px] place-items-center p-8 text-[8px] text-black/32">No matching customers.</div>}</div>
      </div>

      <aside className="studio-card flex min-h-0 flex-col overflow-hidden">{!selected?<div className="grid h-full place-items-center text-[8px] text-black/30">Select a customer.</div>:<div className="tcc-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-black/[.07] p-4"><div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-[12px] bg-black text-[9px] font-extrabold text-white">{selected.firstName[0]}{selected.lastName[0]}</span><div className="min-w-0"><p className="text-[13px] font-bold">{selected.firstName} {selected.lastName}</p><p className="mt-1 text-[7px] text-black/35">{selected.email}</p><p className="mt-1 text-[7px] text-black/35">{selected.phone||"No phone"}</p></div><span className="ml-auto rounded-full bg-[#eef6dd] px-2.5 py-1 text-[7px] font-bold text-[#5f7f17]">{getPayungTier(selected.lifetimeSpend).name}</span></div>
          <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={()=>setOrdersOpen(true)} className="text-left transition hover:-translate-y-px"><Mini label="Orders" value={customerOrders.length}/></button><Mini label="Spend" value={money(selected.lifetimeSpend)}/><Mini label="Joined" value={date(selected.joinedAt)}/></div>
        </div>
        <div className="p-4"><section><div className="flex items-center justify-between"><p className="text-[8px] font-bold">Customer profile</p><Link href="/studio/payung" className="text-[6px] font-bold text-black/38">Payung Program ↗</Link></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><Info label="Email" value={selected.email}/><Info label="Phone" value={selected.phone||"—"}/><Info label="Birthday" value={date(selected.birthday)}/><Info label="Last seen" value={date(selected.lastSeenAt)}/></div>{selected.defaultAddress&&<div className="mt-2 rounded-[12px] border border-black/[.06] bg-[#f7f7f3] p-3"><p className="text-[6px] font-bold uppercase tracking-[.08em] text-black/28">Saved address</p><p className="mt-2 text-[8px] leading-4 text-black/58">{[selected.defaultAddress.address1,selected.defaultAddress.address2,`${selected.defaultAddress.postcode} ${selected.defaultAddress.city}`,selected.defaultAddress.state,selected.defaultAddress.country].filter(Boolean).join(", ")}</p></div>}</section>
          <section className="mt-5 border-t border-black/[.07] pt-4"><label><span className="studio-field-label">Internal note</span><textarea value={note} onChange={e=>setNote(e.target.value)} className="studio-input min-h-[92px] resize-none px-3 py-3.5 leading-5 placeholder:leading-5" placeholder="Customer-service context"/></label><button onClick={saveNote} className="studio-button-secondary mt-2 w-full">{saved?"Saved ✓":"Save note"}</button></section>
        </div>
      </div>}</aside>
    </section>

    <CustomerOrdersDrawer open={ordersOpen} onClose={()=>setOrdersOpen(false)} customer={selected} orders={customerOrders}/>
  </div>;
}

function CustomerOrdersDrawer({open,onClose,customer,orders}:{open:boolean;onClose:()=>void;customer:CustomerDirectoryEntry|null;orders:DemoOrder[]}){
  return <div className={`fixed inset-0 z-[95] ${open?"pointer-events-auto":"pointer-events-none"}`}>
    <button type="button" onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity ${open?"opacity-100":"opacity-0"}`} aria-label="Close customer orders"/>
    <aside className={`absolute inset-y-0 right-0 flex w-[min(92vw,440px)] flex-col bg-[#f8f8f5] shadow-[-22px_0_60px_rgba(0,0,0,.16)] transition-transform duration-300 [transition-timing-function:var(--ease-tcc)] ${open?"translate-x-0":"translate-x-[105%]"}`}>
      <div className="flex h-16 items-center border-b border-black/[.07] px-4"><div><p className="text-[10px] font-bold">Orders</p><p className="mt-1 text-[7px] text-black/35">{customer?`${customer.firstName} ${customer.lastName}`:"Customer"} · {orders.length}</p></div><button type="button" onClick={onClose} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-black/10 bg-white" aria-label="Close"><CloseIcon className="h-4 w-4"/></button></div>
      <div className="tcc-scroll min-h-0 flex-1 overflow-y-auto p-3">{orders.length?orders.map(order=><Link key={order.id} href={`/studio/orders?order=${order.reference}`} onClick={onClose} className="mb-2 block rounded-[13px] border border-black/[.07] bg-white p-3 transition hover:-translate-y-px hover:shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-bold">{order.reference}</p><p className="mt-1 text-[6px] text-black/32">{date(order.createdAt)} · {order.fulfillmentType}</p></div><span className="rounded-full bg-black/[.05] px-2 py-1 text-[6px] font-bold capitalize text-black/52">{order.status.replaceAll("-"," ")}</span></div><div className="mt-3 flex items-center justify-between border-t border-black/[.06] pt-2"><span className="text-[7px] text-black/36">{order.items.length} item{order.items.length===1?"":"s"}</span><strong className="text-[8px]">{order.paymentMethod==="payung-points"?`${order.pointsTotal??0} pts`:money(order.total)}</strong></div></Link>):<div className="grid h-full min-h-[240px] place-items-center text-[8px] text-black/30">No linked orders.</div>}</div>
    </aside>
  </div>;
}

function CompactMetric({icon,label,value}:{icon:"customers"|"orders"|"ranking";label:string;value:number}){return <div className="studio-compact-metric flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-black/[.045]"><StudioIcon name={icon} className="h-4 w-4 text-black/42"/></span><div><p className="text-[18px] font-bold">{value}</p><p className="text-[7px] text-black/36">{label}</p></div></div>}
function Mini({label,value}:{label:string;value:string|number}){return <div className="rounded-[11px] bg-[#f6f6f2] p-3"><p className="text-[6px] text-black/32">{label}</p><p className="mt-1 truncate text-[9px] font-bold">{value}</p></div>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-[11px] border border-black/[.06] bg-white p-3"><p className="text-[6px] font-bold uppercase tracking-[.08em] text-black/28">{label}</p><p className="mt-2 break-words text-[8px] font-semibold">{value}</p></div>}

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { StudioIcon } from "@/components/studio/studio-icons";
import { StudioTableSkeleton } from "@/components/studio/studio-skeleton";
import { useStudio } from "@/components/studio/studio-provider";
import { advanceDemoOrderStatus, cancelDemoOrder, getDemoOrderStatusSequence, refundDemoOrder, updateDemoOrderTracking } from "@/lib/services/demo-order-service";
import type { DemoOrder, DemoOrderStatus } from "@/lib/commerce/contracts";

const NOTES_KEY = "tcc-demo-order-notes-v1";
type StatusFilter = "all" | "open" | "processing" | "shipped" | "completed" | "exceptions";

function money(value: number) { return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(value); }
function nextLabel(order: DemoOrder) {
  if (["cancelled","refunded"].includes(order.status)) return "Complete";
  const sequence = getDemoOrderStatusSequence(order); const index = sequence.indexOf(order.status); const next = sequence[Math.min(Math.max(index,0)+1, sequence.length-1)];
  return next === order.status ? "Complete" : `Move to ${next.replaceAll("-"," ")}`;
}
function statusTone(status: DemoOrderStatus) {
  if (["cancelled","refunded"].includes(status)) return "studio-status studio-status-red";
  if (["delivered","collected"].includes(status)) return "studio-status studio-status-green";
  if (["shipped","ready-for-pickup"].includes(status)) return "studio-status studio-status-blue";
  if (["processing","packed"].includes(status)) return "studio-status studio-status-purple";
  return "studio-status studio-status-amber";
}
function matchesFilter(order: DemoOrder, filter: StatusFilter) {
  if (filter === "all") return true;
  if (filter === "open") return order.status === "confirmed";
  if (filter === "processing") return ["processing","packed"].includes(order.status);
  if (filter === "shipped") return ["shipped","ready-for-pickup"].includes(order.status);
  if (filter === "exceptions") return ["cancelled","refunded"].includes(order.status);
  return ["delivered","collected"].includes(order.status);
}
function readNotes(): Record<string,string> { try { return JSON.parse(localStorage.getItem(NOTES_KEY)||"{}") as Record<string,string>; } catch { return {}; } }

export function StudioOrdersView() {
  const searchParams = useSearchParams();
  const { orders, hydrated, refreshOrders } = useStudio();
  const [busy, setBusy] = useState<string | null>(null);
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState<StatusFilter>("all");
  const [fulfillment,setFulfillment]=useState<"all"|"delivery"|"pickup">("all");
  const [selectedRef,setSelectedRef]=useState<string|null>(null);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [draftNote,setDraftNote]=useState("");
  const [trackingNumber,setTrackingNumber]=useState("");
  const [trackingUrl,setTrackingUrl]=useState("");

  useEffect(()=>{ setNotes(readNotes()); },[]);
  useEffect(()=>{ const requested=searchParams.get("order"); if(requested&&orders.some((order)=>order.reference===requested)) setSelectedRef(requested); },[orders,searchParams]);
  useEffect(()=>{ const status=searchParams.get("status") as StatusFilter|null; if(status&&["all","open","processing","shipped","completed","exceptions"].includes(status)) setFilter(status); },[searchParams]);
  useEffect(()=>{ if(selectedRef) setDraftNote(notes[selectedRef]??""); },[selectedRef,notes]);
  useEffect(()=>{const order=orders.find((item)=>item.reference===selectedRef);setTrackingNumber(order?.trackingNumber??"");setTrackingUrl(order?.trackingUrl??"");},[selectedRef,orders]);

  const filtered=useMemo(()=>{const term=query.trim().toLowerCase();return orders.filter((order)=>{
    if(!matchesFilter(order,filter)) return false;
    if(fulfillment!=="all"&&order.fulfillmentType!==fulfillment) return false;
    if(!term) return true;
    return [order.reference,order.contact.firstName,order.contact.lastName,order.contact.email,order.contact.phone,...order.items.map((item)=>item.name)].some((value)=>value.toLowerCase().includes(term));
  });},[orders,query,filter,fulfillment]);
  const selected=orders.find((order)=>order.reference===selectedRef)??null;

  function advance(reference:string){setBusy(reference);advanceDemoOrderStatus(reference);refreshOrders();window.setTimeout(()=>setBusy(null),180);}
  function saveNote(){if(!selected)return;const next={...notes,[selected.reference]:draftNote.trim()};setNotes(next);localStorage.setItem(NOTES_KEY,JSON.stringify(next));}
  function refund(order:DemoOrder){if(order.paymentMethod==="payung-points"||order.refundAmount||order.status==="cancelled")return;if(!confirm(`Simulate full refund for ${order.reference}?`))return;refundDemoOrder(order.reference);refreshOrders();}
  function cancel(order:DemoOrder){if(["delivered","collected","cancelled","refunded"].includes(order.status))return;if(!confirm(`Cancel ${order.reference}?`))return;cancelDemoOrder(order.reference);refreshOrders();}
  function saveTracking(){if(!selected||selected.fulfillmentType!=="delivery")return;updateDemoOrderTracking(selected.reference,trackingNumber,trackingUrl);refreshOrders();}
  function open(order:DemoOrder){setSelectedRef(order.reference);setDraftNote(notes[order.reference]??"");setTrackingNumber(order.trackingNumber??"");setTrackingUrl(order.trackingUrl??"");}

  const filters: {id:StatusFilter;label:string;count:number}[]=[
    {id:"all",label:"All",count:orders.length},
    {id:"open",label:"New",count:orders.filter((order)=>matchesFilter(order,"open")).length},
    {id:"processing",label:"Processing",count:orders.filter((order)=>matchesFilter(order,"processing")).length},
    {id:"shipped",label:"In transit / ready",count:orders.filter((order)=>matchesFilter(order,"shipped")).length},
    {id:"completed",label:"Completed",count:orders.filter((order)=>matchesFilter(order,"completed")).length},
    {id:"exceptions",label:"Cancelled / refunded",count:orders.filter((order)=>matchesFilter(order,"exceptions")).length},
  ];

  return <div className="studio-page studio-page-flush">
    <section className="studio-card studio-list-frame">
      <div className="flex flex-col gap-3 border-b border-black/[.07] p-3 sm:flex-row sm:items-center sm:p-4">
        <label className="relative min-w-0 flex-1"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/30"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search reference, customer, email or product" className="studio-input h-10 pl-9"/></label>
        <div className="flex flex-wrap items-center gap-1.5">{filters.map((item)=><button key={item.id} onClick={()=>setFilter(item.id)} className={`rounded-full px-3 py-2 text-[7px] font-bold transition ${filter===item.id?"bg-black text-white":"border border-black/[.08] bg-white text-black/42 hover:text-black"}`}>{item.label}<span className={`ml-1.5 ${filter===item.id?"text-white/45":"text-black/25"}`}>{item.count}</span></button>)}</div>
        <div className="flex rounded-[10px] bg-black/[.04] p-1">{(["all","delivery","pickup"] as const).map((value)=><button key={value} onClick={()=>setFulfillment(value)} className={`rounded-[8px] px-3 py-2 text-[7px] font-bold capitalize ${fulfillment===value?"bg-white shadow-sm":"text-black/38"}`}>{value}</button>)}</div>
      </div>

      {!hydrated?<div className="studio-list-scroll"><StudioTableSkeleton rows={7}/></div>:!filtered.length?<div className="studio-list-scroll grid place-items-center px-5 py-16 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-black/[.045]"><StudioIcon name="orders" className="h-4 w-4 text-black/36"/></span><p className="mt-3 text-[11px] font-bold">No matching orders</p><p className="mt-1 text-[8px] text-black/36">Try another search or queue filter.</p></div>:<div className="studio-list-scroll tcc-scroll overflow-auto">
        <table className="studio-data-table min-w-[900px] text-left"><thead><tr className="border-b border-black/[.06] text-[6px] font-bold uppercase tracking-[.09em] text-black/30"><th className="px-5 py-3">Order</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Fulfilment</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3 text-right">Total</th><th className="w-12 px-4 py-3"/></tr></thead><tbody>{filtered.map((order)=><tr key={order.id} onClick={()=>open(order)} className="cursor-pointer border-b border-black/[.05] last:border-0 transition hover:bg-black/[.018]"><td className="px-5 py-3.5"><p className="text-[8px] font-bold">{order.reference}</p><p className="mt-1 text-[6px] text-black/30">{new Date(order.createdAt).toLocaleString("en-MY",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</p></td><td className="px-3 py-3.5"><p className="text-[8px] font-semibold">{order.contact.firstName} {order.contact.lastName}</p><p className="mt-1 text-[6px] text-black/30">{order.contact.email}</p></td><td className="px-3 py-3.5"><p className="text-[8px] font-semibold capitalize">{order.fulfillmentType}</p><p className="mt-1 text-[6px] text-black/30">{order.items.length} item{order.items.length===1?"":"s"}</p></td><td className="px-3 py-3.5"><span className={statusTone(order.status)}>{order.status.replaceAll("-"," ")}</span></td><td className="px-3 py-3.5"><p className="text-[7px] font-semibold">{order.paymentMethodLabel}</p>{order.refundAmount? <p className="mt-1 text-[6px] font-bold text-[#b64c3c]">Refunded {money(order.refundAmount)}</p> : order.promoCode&&<p className="mt-1 text-[6px] text-black/30">{order.promoCode}</p>}</td><td className="px-3 py-3.5 text-right text-[8px] font-bold">{order.paymentMethod==="payung-points"?`${order.pointsTotal??0} pts`:money(order.total)}</td><td className="px-4 py-3.5 text-right"><button type="button" onClick={(event)=>{event.stopPropagation();open(order);}} className="rounded-[8px] border border-black/[.08] bg-white px-2.5 py-1.5 text-[6px] font-bold text-black/48 hover:border-black/[.16] hover:text-black">View</button></td></tr>)}</tbody></table>
      </div>}
    </section>

    <div className={`fixed inset-0 z-[90] ${selected?"pointer-events-auto":"pointer-events-none"}`}>
      <button onClick={()=>setSelectedRef(null)} className={`absolute inset-0 bg-black/45 transition-opacity ${selected?"opacity-100":"opacity-0"}`} aria-label="Close order details"/>
      <aside className={`absolute inset-y-0 right-0 flex w-[min(94vw,520px)] flex-col bg-[#f8f8f5] shadow-[-24px_0_60px_rgba(0,0,0,.18)] transition-transform duration-300 [transition-timing-function:var(--ease-tcc)] ${selected?"translate-x-0":"translate-x-[105%]"}`}>
        {selected&&<>
          <div className="flex h-16 items-center border-b border-black/[.07] px-4"><div><p className="text-[10px] font-bold">{selected.reference}</p><p className="mt-1 text-[7px] text-black/35">{new Date(selected.createdAt).toLocaleString("en-MY")}</p></div><button onClick={()=>setSelectedRef(null)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-black/10 bg-white"><CloseIcon className="h-4 w-4"/></button></div>
          <div className="tcc-scroll flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2"><Info label="Status"><span className={statusTone(selected.status)}>{selected.status.replaceAll("-"," ")}</span></Info><Info label="Fulfilment"><strong className="capitalize">{selected.fulfillmentType}</strong></Info><Info label="Payment"><strong>{selected.paymentMethodLabel}</strong></Info><Info label="Total"><strong>{selected.paymentMethod==="payung-points"?`${selected.pointsTotal??0} pts`:money(selected.total)}</strong></Info></div>
            <Section title="Customer"><p className="text-[9px] font-bold">{selected.contact.firstName} {selected.contact.lastName}</p><p className="mt-1 text-[8px] text-black/45">{selected.contact.email}</p><p className="mt-1 text-[8px] text-black/45">{selected.contact.phone}</p></Section>
            <Section title={selected.fulfillmentType==="pickup"?"Pickup":"Delivery"}>{selected.fulfillmentType==="pickup"?<><p className="text-[9px] font-bold">{selected.pickupLocation?.name}</p><p className="mt-1 text-[8px] leading-4 text-black/45">{selected.pickupLocation?.address}</p></>:<><p className="text-[9px] font-bold">{selected.shippingMethodLabel}</p><p className="mt-1 text-[8px] leading-4 text-black/45">{selected.shippingAddress?[selected.shippingAddress.address1,selected.shippingAddress.address2,`${selected.shippingAddress.postcode} ${selected.shippingAddress.city}`,selected.shippingAddress.state,selected.shippingAddress.country].filter(Boolean).join(", "):"No address"}</p></>}</Section>
            {selected.fulfillmentType==="delivery"&&<Section title="Tracking"><div className="grid gap-2 sm:grid-cols-2"><label><span className="studio-field-label">Tracking number</span><input value={trackingNumber} onChange={(event)=>setTrackingNumber(event.target.value)} className="studio-input" placeholder="Carrier reference"/></label><label><span className="studio-field-label">Tracking URL</span><input value={trackingUrl} onChange={(event)=>setTrackingUrl(event.target.value)} className="studio-input" placeholder="https://..."/></label></div><button onClick={saveTracking} className="studio-button-secondary mt-2 w-full">Save tracking</button></Section>}
            <Section title="Items"><div className="space-y-2">{selected.items.map((item)=><div key={item.key} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-[12px] border border-black/[.06] bg-white p-2"><span className="h-12 w-12 overflow-hidden rounded-[9px] bg-[#f0efe9]">{item.image?<img src={item.image} alt="" className="h-full w-full object-cover"/>:null}</span><div className="min-w-0"><p className="truncate text-[8px] font-bold">{item.name}</p><p className="mt-1 text-[6px] text-black/35">{item.variantLabel} · Qty {item.quantity}</p></div><strong className="text-[8px]">{item.pricingMode==="points"?`${(item.unitPoints??0)*item.quantity} pts`:money(item.unitPrice*item.quantity)}</strong></div>)}</div></Section>
            {selected.paymentMethod!=="payung-points"&&<Section title="Totals"><div className="space-y-2 text-[8px]"><TotalRow label="Subtotal" value={money(selected.subtotal)}/>{selected.discount>0&&<TotalRow label={`Discount${selected.promoCode?` · ${selected.promoCode}`:""}`} value={`−${money(selected.discount)}`}/>}<TotalRow label="Delivery" value={money(selected.shipping)}/>{selected.refundAmount? <TotalRow label="Refund" value={`−${money(selected.refundAmount)}`}/> : null}<div className="border-t border-black/10 pt-2"><TotalRow label="Total" value={money(selected.total)} strong/></div></div></Section>}
            <Section title="Timeline"><div className="space-y-3">{selected.timeline.map((event,index)=><div key={`${event.status}-${event.at}-${index}`} className="grid grid-cols-[10px_1fr] gap-3"><span className={`mt-1.5 h-2 w-2 rounded-full ${index===selected.timeline.length-1?"bg-[#79a54f]":"bg-black/15"}`}/><div><p className="text-[8px] font-bold capitalize">{event.status.replaceAll("-"," ")}</p><p className="mt-1 text-[6px] text-black/32">{new Date(event.at).toLocaleString("en-MY")}</p></div></div>)}</div></Section>
            <Section title="Internal note"><textarea value={draftNote} onChange={(event)=>setDraftNote(event.target.value)} rows={3} className="studio-input min-h-[78px] resize-none py-3" placeholder="Add an operational note"/><button onClick={saveNote} className="studio-button-secondary mt-2 w-full">Save note</button></Section>
          </div>
          <div className="grid gap-2 border-t border-black/[.07] bg-white p-4 sm:grid-cols-[1fr_auto_auto]"><button disabled={nextLabel(selected)==="Complete"||busy===selected.reference} onClick={()=>advance(selected.reference)} className="studio-button w-full disabled:cursor-default disabled:opacity-35">{busy===selected.reference?"Updating…":nextLabel(selected)}</button><button disabled={["delivered","collected","cancelled","refunded"].includes(selected.status)} onClick={()=>cancel(selected)} className="rounded-[11px] border border-black/10 px-4 text-[8px] font-bold text-black/55 disabled:opacity-30">{selected.status==="cancelled"?"Cancelled":"Cancel"}</button>{selected.paymentMethod!=="payung-points"&&<button disabled={Boolean(selected.refundAmount)||selected.status==="cancelled"} onClick={()=>refund(selected)} className="rounded-[11px] border border-[#d66a58]/20 px-4 text-[8px] font-bold text-[#b64c3c] disabled:opacity-35">{selected.refundAmount?"Refunded":"Refund"}</button>}</div>
        </>}
      </aside>
    </div>
  </div>;
}

function Info({label,children}:{label:string;children:ReactNode}){return <div className="rounded-[12px] border border-black/[.06] bg-white p-3"><p className="text-[6px] font-bold uppercase tracking-[.08em] text-black/28">{label}</p><div className="mt-2 text-[8px]">{children}</div></div>}
function Section({title,children}:{title:string;children:ReactNode}){return <section className="mt-4 rounded-[14px] border border-black/[.06] bg-white p-4"><p className="mb-3 text-[8px] font-bold">{title}</p>{children}</section>}
function TotalRow({label,value,strong=false}:{label:string;value:string;strong?:boolean}){return <div className={`flex justify-between gap-4 ${strong?"text-[10px] font-bold":""}`}><span className="text-black/45">{label}</span><span>{value}</span></div>}

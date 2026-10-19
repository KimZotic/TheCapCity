"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderStatusTimeline } from "@/components/checkout/order-status-timeline";
import { useAccount } from "@/components/account/account-provider";
import type { DemoOrder } from "@/lib/commerce/contracts";
import { advanceDemoOrderStatus, findDemoOrder, getDemoOrderStatusSequence } from "@/lib/services/demo-order-service";

function money(value: number) { return `RM${value.toFixed(2)}`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export function TrackingView() {
  const searchParams = useSearchParams();
  const { customer } = useAccount();
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const initialReference = searchParams.get("reference");
    if (initialReference) setReference(initialReference);
    if (customer?.email) setContact((current) => current || customer.email);
  }, [searchParams, customer]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reference.trim() || !contact.trim()) { setOrder(null); setMessage("Enter the order reference and checkout email or phone."); return; }
    const found = findDemoOrder(reference, contact); setOrder(found); setMessage(found ? "" : "No matching demo order was found in this browser.");
  }
  function advance() { if (!order) return; const updated = advanceDemoOrderStatus(order.reference); if (updated) setOrder(updated); }
  const isComplete = order ? getDemoOrderStatusSequence(order).at(-1) === order.status : false;

  return <section className="min-h-[68vh] bg-[#0b0b0d] px-3 py-6 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-9"><div className="mx-auto max-w-[1120px]">
    <header className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><h1 className="font-display text-[clamp(1.8rem,5vw,2.65rem)] leading-none">Track your order.</h1>{customer && <Link href="/account" className="text-[9px] font-semibold text-white/42 hover:text-white">View account orders ↗</Link>}</header>
    <form onSubmit={submit} className="mt-5 grid gap-3 rounded-[20px_20px_7px_20px] bg-[#f1f0eb] p-4 text-black sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label><span className="text-[8px] font-semibold text-black/42">Order reference</span><input value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="TCC-261018-1234" className="mt-1.5 h-11 w-full rounded-[12px_12px_4px_12px] border border-black/[.10] bg-white px-3 text-[11px] font-semibold uppercase outline-none transition focus:border-black/45"/></label><label><span className="text-[8px] font-semibold text-black/42">Email or phone</span><input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Used at checkout" className="mt-1.5 h-11 w-full rounded-[12px_12px_4px_12px] border border-black/[.10] bg-white px-3 text-[11px] font-semibold outline-none transition focus:border-black/45"/></label><button type="submit" className="h-11 rounded-[12px_12px_4px_12px] bg-black px-5 text-[9px] font-bold text-white">Find order ↗</button>{message && <p role="alert" className="text-[8px] font-semibold leading-4 text-[#b83722] sm:col-span-3">{message}</p>}</form>
    {order && <div className="mt-4 space-y-4"><div className="relative overflow-hidden rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4 sm:p-5"><div className="absolute right-0 top-0 h-full w-[32%] bg-[linear-gradient(135deg,transparent,#5b6cff18)]"/><div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-[8px] text-white/35">Order reference</p><p className="mt-1 text-[16px] font-bold">{order.reference}</p><p className="mt-1 text-[7px] text-white/32">Placed {formatDate(order.createdAt)}</p></div><div className="sm:text-right"><p className="text-[8px] text-white/35">Total</p><p className="mt-1 text-[16px] font-bold">{order.paymentMethod === "payung-points" ? `${(order.pointsTotal ?? 0).toLocaleString()} pts` : money(order.total)}</p></div></div></div><div className="text-black"><OrderStatusTimeline order={order}/></div><div className="grid gap-4 lg:grid-cols-[1fr_290px]"><section className="overflow-hidden rounded-[20px_20px_7px_20px] bg-[#f1f0eb] text-black"><div className="border-b border-black/[.08] px-4 py-3"><p className="text-[11px] font-semibold">Items</p></div><div className="px-4">{order.items.map((item) => <div key={item.key} className="grid grid-cols-[52px_1fr_auto] gap-3 border-b border-black/[.08] py-3 last:border-0"><div className="aspect-square overflow-hidden rounded-[9px_9px_3px_9px] bg-black/5">{item.image ? <img src={item.image} alt="" className="h-full w-full object-cover"/> : null}</div><div className="min-w-0"><p className="text-[9px] font-bold leading-4">{item.name}</p><p className="mt-1 text-[7px] text-black/40">{item.variantLabel} · Qty {item.quantity}</p></div><span className="text-[8px] font-bold">{item.pricingMode === "points" ? `${((item.unitPoints ?? 0) * item.quantity).toLocaleString()} pts` : money(item.unitPrice * item.quantity)}</span></div>)}</div></section><aside className="space-y-3"><div className="rounded-[20px_20px_7px_20px] bg-[#f1f0eb] p-4 text-black"><p className="text-[11px] font-semibold">{order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</p><p className="mt-2 text-[10px] font-bold">{order.shippingMethodLabel}</p>{order.fulfillmentType === "pickup" && order.pickupLocation ? <p className="mt-1 text-[8px] leading-4 text-black/42">{order.pickupLocation.name}<br/>{order.pickupLocation.address}</p> : order.shippingAddress ? <><p className="mt-1 text-[8px] leading-4 text-black/42">{order.shippingAddress.postcode} {order.shippingAddress.city}, {order.shippingAddress.state}<br/>{order.shippingAddress.country}</p>{order.trackingNumber&&<div className="mt-3 border-t border-black/10 pt-3"><p className="text-[7px] text-black/35">Tracking</p><p className="mt-1 text-[9px] font-bold">{order.trackingNumber}</p>{order.trackingUrl&&<a href={order.trackingUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-[8px] font-bold underline underline-offset-4">Open carrier tracking ↗</a>}</div>}</> : null}</div><div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4"><p className="text-[9px] font-semibold">Demo fulfilment control</p><p className="mt-2 text-[8px] leading-4 text-white/40">Advance status to present the full {order.fulfillmentType === "pickup" ? "pickup" : "delivery"} journey.</p><button type="button" disabled={isComplete} onClick={advance} className="mt-3 rounded-[12px_12px_4px_12px] bg-white px-3.5 py-2.5 text-[8px] font-bold text-black disabled:opacity-35">{isComplete ? "Journey complete" : "Advance status ↗"}</button></div></aside></div></div>}
  </div></section>;
}

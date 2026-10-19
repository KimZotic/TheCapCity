"use client";

import type { DemoOrder, DemoOrderStatus } from "@/lib/commerce/contracts";
import { getDemoOrderStatusSequence } from "@/lib/services/demo-order-service";

const labels: Record<DemoOrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  "ready-for-pickup": "Ready for pickup",
  collected: "Collected",
  cancelled: "Cancelled",
  refunded: "Refunded"
};
function formatDate(value: string) { return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export function OrderStatusTimeline({ order }: { order: DemoOrder }) {
  const sequence = getDemoOrderStatusSequence(order);
  const activeIndex = sequence.indexOf(order.status);
  const events = new Map(order.timeline.map((event) => [event.status, event]));
  const progress = activeIndex <= 0 ? 0 : (activeIndex / (sequence.length - 1)) * 100;
  return <section className="overflow-hidden rounded-[20px_20px_7px_20px] border border-black/[.08] bg-[#fcfcfa] p-4 sm:p-5">
    <div className="mb-5 flex items-center justify-between gap-4"><p className="text-[12px] font-semibold tracking-[-.02em]">{order.fulfillmentType === "pickup" ? "Pickup progress" : "Delivery progress"}</p><span className="flex items-center gap-2 rounded-full bg-black px-2.5 py-1.5 text-[8px] font-bold text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#d7ff57]"/>{labels[order.status]}</span></div>
    <div className="relative hidden sm:block"><div className="absolute left-2 right-2 top-[7px] h-px bg-black/10"/><div className="absolute left-2 top-[7px] h-px bg-black transition-[width] duration-500" style={{ width: `calc(${progress}% - 4px)` }}/><ol className="relative grid" style={{ gridTemplateColumns: `repeat(${sequence.length}, minmax(0, 1fr))` }}>{sequence.map((status,index) => { const reached = index <= activeIndex; const event = events.get(status); return <li key={status} className="pr-2"><span className={`block h-[15px] w-[15px] rounded-full border-[4px] ${reached ? "border-black bg-[#d7ff57]" : "border-[#f1f0eb] bg-[#c8c8c3]"}`}/><p className={`mt-2 text-[8px] font-bold ${reached ? "text-black" : "text-black/30"}`}>{labels[status]}</p><p className="mt-1 text-[7px] leading-3 text-black/34">{event ? formatDate(event.at) : "Pending"}</p></li>; })}</ol></div>
    <ol className="grid gap-0 sm:hidden">{sequence.map((status,index) => { const reached = index <= activeIndex; const event = events.get(status); return <li key={status} className="relative flex gap-3 pb-4 last:pb-0"><div className="relative flex w-4 shrink-0 justify-center"><span className={`relative z-10 mt-0.5 h-3 w-3 rounded-full border-[3px] ${reached ? "border-black bg-[#d7ff57]" : "border-[#f1f0eb] bg-[#c8c8c3]"}`}/>{index < sequence.length - 1 && <span className={`absolute bottom-[-2px] top-3 w-px ${index < activeIndex ? "bg-black" : "bg-black/10"}`}/>}</div><div><p className={`text-[9px] font-bold ${reached ? "text-black" : "text-black/30"}`}>{labels[status]}</p><p className="mt-0.5 text-[7px] text-black/34">{event ? formatDate(event.at) : "Pending"}</p></div></li>; })}</ol>
  </section>;
}

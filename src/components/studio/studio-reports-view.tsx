"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudio } from "@/components/studio/studio-provider";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { useOperations } from "@/components/commerce/operations-provider";
import { StudioIcon } from "@/components/studio/studio-icons";
import { StudioTrendChart } from "@/components/studio/studio-trend-chart";
import { readCustomerDirectory } from "@/lib/account/customer-storage";
import type { DemoOrder } from "@/lib/commerce/contracts";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

function money(value: number) { return `RM ${Math.round(value).toLocaleString("en-MY")}`; }
function percent(value: number) { return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`; }
function csvCell(value: unknown) { const text=String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text; }

function paidOrders(orders: DemoOrder[]) { return orders.filter((order)=>order.paymentMethod!=="payung-points"); }
function revenueOf(orders: DemoOrder[]) { return paidOrders(orders).reduce((sum,order)=>sum+Math.max(0,order.total-(order.refundAmount??0)),0); }

export function StudioReportsView() {
  const { orders } = useStudio();
  const { state: catalog } = useCatalog();
  const { state: operations } = useOperations();
  const [period, setPeriod] = useState<Period>(30);
  const [customerStats, setCustomerStats] = useState({ count:0, points:0, members:0 });

  useEffect(()=>{
    const refresh=()=>{ const customers=readCustomerDirectory(); setCustomerStats({ count:customers.length, points:customers.reduce((sum,item)=>sum+item.points,0), members:customers.filter((item)=>item.points>0||item.lifetimeSpend>0).length }); };
    refresh(); window.addEventListener("tcc:customers",refresh as EventListener); window.addEventListener("tcc:payung-program",refresh as EventListener);
    return()=>{ window.removeEventListener("tcc:customers",refresh as EventListener); window.removeEventListener("tcc:payung-program",refresh as EventListener); };
  },[]);

  const now = Date.now();
  const cutoff = now - period*86400000;
  const previousCutoff = cutoff - period*86400000;
  const scoped = useMemo(()=>orders.filter((order)=>new Date(order.createdAt).getTime()>=cutoff),[orders,cutoff]);
  const previous = useMemo(()=>orders.filter((order)=>{ const time=new Date(order.createdAt).getTime(); return time>=previousCutoff&&time<cutoff; }),[orders,previousCutoff,cutoff]);
  const paid = paidOrders(scoped);
  const revenue = revenueOf(scoped);
  const previousRevenue = revenueOf(previous);
  const revenueDelta = previousRevenue ? ((revenue-previousRevenue)/previousRevenue)*100 : revenue ? 100 : 0;
  const refunds = paid.reduce((sum,order)=>sum+(order.refundAmount??0),0);
  const discounts = paid.reduce((sum,order)=>sum+order.discount,0);
  const aov = paid.length ? revenue/paid.length : 0;
  const inventoryValue = catalog.products.filter((record)=>!record.archived).reduce((sum,record)=>sum+record.product.variants.reduce((subtotal,variant)=>subtotal+Math.max(0,variant.stock)*(variant.priceOverride??record.product.price.amount),0),0);

  const trend = useMemo(()=>Array.from({length:period},(_,index)=>{
    const date=new Date(now-(period-1-index)*86400000); const key=date.toISOString().slice(0,10);
    const value=paid.filter((order)=>order.createdAt.slice(0,10)===key).reduce((sum,order)=>sum+Math.max(0,order.total-(order.refundAmount??0)),0);
    return {label:date.toLocaleDateString("en-MY",{day:"numeric",month:"short"}),value};
  }),[paid,period,now]);

  const topProducts = useMemo(()=>{
    const map=new Map<string,{id:string;name:string;qty:number;revenue:number;image?:string}>();
    paid.forEach((order)=>order.items.forEach((line)=>{ const current=map.get(line.productId)??{id:line.productId,name:line.name,qty:0,revenue:0,image:line.image}; current.qty+=line.quantity; current.revenue+=line.unitPrice*line.quantity; map.set(line.productId,current); }));
    return [...map.values()].sort((a,b)=>b.revenue-a.revenue).slice(0,8);
  },[paid]);

  const categoryPerformance = useMemo(()=>{
    const map=new Map<string,{qty:number;revenue:number}>();
    paid.forEach((order)=>order.items.forEach((line)=>{ const current=map.get(line.category)??{qty:0,revenue:0}; current.qty+=line.quantity; current.revenue+=line.unitPrice*line.quantity; map.set(line.category,current); }));
    return [...map.entries()].sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,6);
  },[paid]);

  const collectionPerformance = useMemo(()=>catalog.collections.filter((collection)=>!collection.archived).map((collection)=>{
    const slugs=new Set(collection.productSlugs); let value=0,qty=0;
    paid.forEach((order)=>order.items.forEach((line)=>{ if(slugs.has(line.slug)){ value+=line.unitPrice*line.quantity; qty+=line.quantity; } }));
    return {id:collection.id,name:collection.shortTitle,value,qty};
  }).sort((a,b)=>b.value-a.value).slice(0,5),[catalog.collections,paid]);

  const dropPerformance = useMemo(()=>operations.drops.filter((drop)=>drop.published&&!drop.archived).map((drop)=>{
    const slugs=new Set(drop.productSlugs); let value=0,qty=0;
    paid.forEach((order)=>order.items.forEach((line)=>{ if(slugs.has(line.slug)){ value+=line.unitPrice*line.quantity; qty+=line.quantity; } }));
    return {id:drop.id,name:drop.title,value,qty,status:drop.status};
  }).sort((a,b)=>b.value-a.value).slice(0,5),[operations.drops,paid]);

  const fulfillment = { delivery:scoped.filter((o)=>o.fulfillmentType==="delivery").length, pickup:scoped.filter((o)=>o.fulfillmentType==="pickup").length };
  const payments = [
    {id:"gateway",label:"Card / gateway"}, {id:"online-banking",label:"Online banking"}, {id:"ewallet",label:"E-wallet"}, {id:"payung-points",label:"Payung Points"}
  ].map((item)=>({...item,count:scoped.filter((order)=>order.paymentMethod===item.id).length}));
  const completed=scoped.filter((order)=>["delivered","collected"].includes(order.status)).length;
  const cancelled=scoped.filter((order)=>["cancelled","refunded"].includes(order.status)).length;

  function exportCsv(){
    const rows = [["Reference","Date","Customer","Email","Fulfilment","Payment","Status","Subtotal","Discount","Shipping","Refund","Total"]];
    scoped.forEach((order)=>rows.push([order.reference,order.createdAt,`${order.contact.firstName} ${order.contact.lastName}`,order.contact.email,order.fulfillmentType,order.paymentMethodLabel,order.status,String(order.subtotal),String(order.discount),String(order.shipping),String(order.refundAmount??0),String(order.total)]));
    const blob=new Blob([rows.map((row)=>row.map(csvCell).join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=`tcc-report-${period}d.csv`; link.click(); URL.revokeObjectURL(url);
  }

  return <div className="studio-page studio-page-flush space-y-3">
    <div className="studio-toolbar">
      <div className="studio-segment">{PERIODS.map((value)=><button key={value} onClick={()=>setPeriod(value)} className={period===value?"is-active":""}>{value}D</button>)}</div>
      <button onClick={exportCsv} className="studio-button-secondary">Export CSV</button>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <ReportMetric label="Net revenue" value={money(revenue)} detail={`${percent(revenueDelta)} vs previous`} icon="reports" positive={revenueDelta>=0}/>
      <ReportMetric label="Orders" value={String(scoped.length)} detail={`${completed} completed`} icon="orders"/>
      <ReportMetric label="AOV" value={money(aov)} detail={`${paid.length} paid orders`} icon="overview"/>
      <ReportMetric label="Discounts" value={money(discounts)} detail={`${money(refunds)} refunded`} icon="promotions"/>
      <ReportMetric label="Inventory value" value={money(inventoryValue)} detail={`${catalog.products.filter((record)=>record.published&&!record.archived).length} live products`} icon="inventory"/>
    </div>

    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.45fr)]">
      <section className="studio-card p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold">Revenue performance</p><p className="mt-1 text-[7px] text-black/32">Daily net revenue for the selected window.</p></div><div className="text-right"><p className="text-[7px] text-black/32">Period total</p><p className="mt-1 text-[16px] font-bold">{money(revenue)}</p></div></div>
        <div className="mt-3"><StudioTrendChart points={trend} formatValue={money} height={280}/></div>
      </section>
      <section className="studio-card p-4 sm:p-5">
        <p className="text-[10px] font-bold">Commerce mix</p>
        <div className="mt-4 space-y-4">
          <MixBar label="Delivery" value={fulfillment.delivery} total={Math.max(1,scoped.length)}/>
          <MixBar label="Pickup" value={fulfillment.pickup} total={Math.max(1,scoped.length)}/>
          <div className="border-t border-black/[.06] pt-3">{payments.map((item)=><div key={item.id} className="flex items-center justify-between py-2 text-[8px]"><span className="text-black/45">{item.label}</span><span className="font-bold">{item.count}</span></div>)}</div>
          <div className="grid grid-cols-2 gap-2 border-t border-black/[.06] pt-3"><TinyStat label="Completed" value={completed}/><TinyStat label="Cancelled / refunded" value={cancelled}/></div>
        </div>
      </section>
    </div>

    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
      <section className="studio-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/[.07] px-4 py-3"><p className="text-[10px] font-bold">Top products</p><span className="text-[7px] text-black/30">Units · revenue</span></div>
        <div className="tcc-scroll max-h-[420px] overflow-y-auto">
          {topProducts.length ? topProducts.map((item,index)=><div key={item.id} className="grid grid-cols-[28px_44px_minmax(0,1fr)_70px_90px] items-center gap-3 border-b border-black/[.05] px-4 py-3 last:border-0"><span className="text-[7px] font-bold text-black/25">{String(index+1).padStart(2,"0")}</span><div className="h-10 w-10 overflow-hidden rounded-[9px] bg-[#f0efe9]">{item.image?<img src={item.image} alt="" className="h-full w-full object-cover"/>:null}</div><p className="truncate text-[8px] font-bold">{item.name}</p><span className="text-right text-[8px] font-semibold">{item.qty} units</span><span className="text-right text-[8px] font-bold">{money(item.revenue)}</span></div>) : <div className="grid min-h-40 place-items-center text-[8px] text-black/30">No product sales in this period.</div>}
        </div>
      </section>
      <section className="studio-card p-4 sm:p-5"><p className="text-[10px] font-bold">Customer & loyalty</p><div className="mt-4 grid grid-cols-2 gap-2"><TinyStat label="Profiles" value={customerStats.count}/><TinyStat label="Payung members" value={customerStats.members}/><TinyStat label="Points outstanding" value={customerStats.points.toLocaleString()}/><TinyStat label="Refund exposure" value={money(refunds)}/></div><div className="mt-4 border-t border-black/[.06] pt-3"><p className="text-[7px] text-black/32">Inventory on hand</p><p className="mt-1 text-[15px] font-bold">{money(inventoryValue)}</p></div></section>
    </div>

    <div className="grid gap-3 lg:grid-cols-3">
      <Ranking title="Categories" rows={categoryPerformance.map(([name,data])=>({id:name,name,value:data.revenue,meta:`${data.qty} units`}))}/>
      <Ranking title="Collections" rows={collectionPerformance.map((item)=>({id:item.id,name:item.name,value:item.value,meta:`${item.qty} units`}))}/>
      <Ranking title="Drops & events" rows={dropPerformance.map((item)=>({id:item.id,name:item.name,value:item.value,meta:`${item.qty} units · ${item.status}`}))}/>
    </div>
  </div>;
}

function ReportMetric({label,value,detail,icon,positive}:{label:string;value:string;detail:string;icon:Parameters<typeof StudioIcon>[0]["name"];positive?:boolean}){return <section className="studio-card studio-compact-metric p-4"><div className="flex items-start justify-between"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-black/[.045]"><StudioIcon name={icon} className="h-4 w-4 text-black/40"/></span>{positive!==undefined&&<span className={`text-[7px] font-bold ${positive?"text-[#4d8538]":"text-[#b84b40]"}`}>{detail.split(" ")[0]}</span>}</div><p className="mt-4 text-[7px] font-semibold text-black/35">{label}</p><p className="mt-1 text-[22px] font-bold tracking-[-.035em]">{value}</p><p className="mt-1 text-[7px] text-black/30">{detail}</p></section>}
function MixBar({label,value,total}:{label:string;value:number;total:number}){return <div><div className="flex items-center justify-between text-[8px] font-semibold"><span>{label}</span><span>{value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[.055]"><div className="h-full rounded-full bg-black" style={{width:`${Math.min(100,value/Math.max(1,total)*100)}%`}}/></div></div>}
function TinyStat({label,value}:{label:string;value:string|number}){return <div className="rounded-[12px] bg-[#f6f6f2] p-3"><p className="text-[6px] font-bold uppercase tracking-[.08em] text-black/30">{label}</p><p className="mt-2 text-[12px] font-bold">{value}</p></div>}
function Ranking({title,rows}:{title:string;rows:{id:string;name:string;value:number;meta:string}[]}){const max=Math.max(1,...rows.map((row)=>row.value));return <section className="studio-card overflow-hidden"><div className="border-b border-black/[.07] px-4 py-3"><p className="text-[10px] font-bold">{title}</p></div><div className="min-h-[250px] p-3">{rows.length?rows.map((row,index)=><div key={row.id} className="border-b border-black/[.05] py-3 last:border-0"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[8px] font-bold">{index+1}. {row.name}</p><p className="mt-1 text-[6px] text-black/30">{row.meta}</p></div><span className="shrink-0 text-[8px] font-bold">{money(row.value)}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[.05]"><div className="h-full rounded-full bg-[#668d50]" style={{width:`${row.value/max*100}%`}}/></div></div>):<div className="grid min-h-[220px] place-items-center text-[7px] text-black/30">No performance data yet.</div>}</div></section>}

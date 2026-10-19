"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudioIcon, type StudioIconName } from "@/components/studio/studio-icons";
import { StudioTrendChart } from "@/components/studio/studio-trend-chart";
import { useStudio } from "@/components/studio/studio-provider";
import { useCatalog } from "@/components/commerce/catalog-provider";

const rangeSeries = {
  "7D": [52,58,55,67,63,74,82],
  "30D": [35,39,46,43,52,59,55,66,62,73,81,77],
  "90D": [30,34,32,39,44,49,46,54,60,57,65,71,67,75,82,78],
} as const;
type Range = keyof typeof rangeSeries;
function money(value:number){return new Intl.NumberFormat("en-MY",{style:"currency",currency:"MYR",maximumFractionDigits:0}).format(value)}
function statusClass(status:string){if(["cancelled","refunded"].includes(status))return"studio-status studio-status-red";if(["delivered","collected"].includes(status))return"studio-status studio-status-green";if(["shipped","ready-for-pickup"].includes(status))return"studio-status studio-status-blue";if(["processing","packed"].includes(status))return"studio-status studio-status-purple";return"studio-status studio-status-amber"}

export function StudioOverview(){
  const {metrics,orders,hydrated}=useStudio();
  const {state:catalog}=useCatalog();
  const [range,setRange]=useState<Range>("30D");
  const trend=useMemo(()=>{const series=rangeSeries[range];const max=Math.max(...series);return series.map((value,index)=>({label:range==="7D"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]:range==="30D"?`W${index+1}`:`P${index+1}`,value:Math.round(metrics.grossSales*(.52+.48*value/max))}));},[range,metrics.grossSales]);
  const statuses=[
    ["Pending",orders.filter(o=>o.status==="confirmed").length,"amber","open"],
    ["Processing",orders.filter(o=>["processing","packed"].includes(o.status)).length,"purple","processing"],
    ["In transit / ready",orders.filter(o=>["shipped","ready-for-pickup"].includes(o.status)).length,"blue","shipped"],
    ["Completed",orders.filter(o=>["delivered","collected"].includes(o.status)).length,"green","completed"],
  ] as const;
  const productPerformance=useMemo(()=>{const map=new Map<string,{slug:string;name:string;image?:string;units:number;revenue:number}>();for(const order of orders)for(const line of order.items){const current=map.get(line.productId)??{slug:line.slug,name:line.name,image:line.image,units:0,revenue:0};current.units+=line.quantity;current.revenue+=line.pricingMode==="points"?0:line.unitPrice*line.quantity;map.set(line.productId,current)}const ranked=[...map.values()].sort((a,b)=>b.units-a.units||b.revenue-a.revenue);if(ranked.length)return ranked.slice(0,5);return catalog.products.filter((record)=>record.published&&!record.archived).slice(0,5).map((record,index)=>({slug:record.product.slug,name:record.product.name,image:record.product.image,units:Math.max(1,18-index*3),revenue:record.product.price.amount*Math.max(1,18-index*3)}));},[orders,catalog.products]);
  const metricsCards:Array<{label:string;value:string;delta:string;icon:StudioIconName;tone:string}>=[
    {label:"Revenue",value:money(metrics.grossSales),delta:"+12.4%",icon:"reports",tone:"#edf4e8"},
    {label:"Orders",value:String(metrics.orderCount),delta:"+8.2%",icon:"orders",tone:"#f2edf8"},
    {label:"Conversion",value:`${metrics.conversion.toFixed(1)}%`,delta:"+0.4%",icon:"overview",tone:"#edf2f9"},
    {label:"AOV",value:money(metrics.aov),delta:"+6.1%",icon:"products",tone:"#f7f0e5"},
  ];
  return <div className="studio-page studio-page-flush">
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metricsCards.map(item=><article key={item.label} className="studio-compact-metric"><div className="flex items-start justify-between"><span className="grid h-8 w-8 place-items-center rounded-[10px]" style={{background:item.tone}}><StudioIcon name={item.icon} className="h-3.5 w-3.5 text-black/52"/></span><span className="rounded-full bg-[#eff8e9] px-2 py-1 text-[6px] font-bold text-[#4c7a37]">{item.delta}</span></div><div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-[7px] font-semibold text-black/34">{item.label}</p><p className="mt-1 text-[22px] font-bold tracking-[-.035em]">{item.value}</p></div></div></article>)}</section>

    <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
      <article className="studio-card overflow-hidden"><div className="flex items-center justify-between border-b border-black/[.06] px-4 py-3 sm:px-5"><div><p className="text-[10px] font-bold">Revenue performance</p><p className="mt-1 text-[6px] text-black/30">Interactive operating trend</p></div><div className="studio-segment">{(["7D","30D","90D"] as Range[]).map(item=><button key={item} onClick={()=>setRange(item)} className={range===item?"is-active":""}>{item}</button>)}</div></div><div className="px-3 pb-3 pt-2 sm:px-5"><StudioTrendChart points={trend} formatValue={money} height={300}/></div></article>
      <article className="studio-card p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold">Order queues</p><Link href="/studio/orders" className="text-[7px] font-bold text-black/42 hover:text-black">View all ↗</Link></div><div className="mt-3 grid gap-2">{statuses.map(([label,value,tone,status])=><Link href={`/studio/orders?status=${status}`} key={label} className={`studio-status-row studio-status-row-${tone}`}><span><strong className="block text-[8px]">{label}</strong><span className="mt-1 block text-[6px] text-black/30">Current queue</span></span><strong className="text-[18px]">{value}</strong></Link>)}</div></article>
    </section>

    <section className="mt-3 grid gap-3 xl:grid-cols-[1.08fr_.92fr]">
      <article className="studio-card overflow-hidden"><div className="flex h-[50px] items-center justify-between border-b border-black/[.06] px-4"><p className="text-[10px] font-bold">Recent orders</p><Link href="/studio/orders" className="text-[7px] font-bold text-black/42">View all ↗</Link></div>{!hydrated?<div className="p-4"><div className="studio-skeleton h-40 rounded-xl"/></div>:<div className="tcc-scroll max-h-[330px] overflow-auto"><table className="studio-data-table min-w-[650px] text-left"><thead><tr className="text-[6px] font-bold uppercase tracking-[.08em] text-black/28"><th className="px-4 py-3">Order</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Value</th><th className="px-3 py-3">Status</th><th className="px-4 py-3 text-right">Date</th></tr></thead><tbody>{orders.slice(0,8).map(order=><tr key={order.id} className="border-t border-black/[.05]"><td className="px-4 py-3 text-[8px] font-bold"><Link href={`/studio/orders?order=${order.reference}`}>{order.reference}</Link></td><td className="px-3 py-3"><p className="text-[8px] font-semibold">{order.contact.firstName} {order.contact.lastName}</p><p className="mt-1 text-[6px] text-black/28">{order.items.length} item{order.items.length===1?"":"s"}</p></td><td className="px-3 py-3 text-[8px] font-bold">{order.paymentMethod==="payung-points"?`${order.pointsTotal??0} pts`:money(order.total)}</td><td className="px-3 py-3"><span className={statusClass(order.status)}>{order.status.replaceAll("-"," ")}</span></td><td className="px-4 py-3 text-right text-[7px] text-black/30">{new Date(order.createdAt).toLocaleDateString("en-MY")}</td></tr>)}{orders.length===0&&<tr><td colSpan={5} className="px-5 py-14 text-center text-[8px] text-black/30">No storefront orders yet.</td></tr>}</tbody></table></div>}</article>
      <article className="studio-card overflow-hidden"><div className="flex h-[50px] items-center justify-between border-b border-black/[.06] px-4"><div className="flex items-center gap-2"><StudioIcon name="ranking" className="h-4 w-4 text-black/40"/><p className="text-[10px] font-bold">Product ranking</p></div><Link href="/studio/products" className="text-[7px] font-bold text-black/42">Catalogue ↗</Link></div><div className="p-2">{productPerformance.map((product,index)=><Link href="/studio/products" key={`${product.slug}-${index}`} className="grid grid-cols-[26px_42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[11px] px-2 py-2.5 hover:bg-black/[.025]"><span className="text-center text-[8px] font-bold text-black/24">{String(index+1).padStart(2,"0")}</span><span className="h-10 w-10 overflow-hidden rounded-[9px] bg-[#f0efe9]">{product.image?<img src={product.image} alt="" className="h-full w-full object-cover"/>:null}</span><span className="min-w-0"><strong className="block truncate text-[8px]">{product.name}</strong><span className="mt-1 block text-[6px] text-black/30">{product.units} units</span></span><span className="text-right"><strong className="block text-[8px]">{money(product.revenue)}</strong><span className="mt-1 block text-[6px] text-black/26">revenue</span></span></Link>)}</div></article>
    </section>
  </div>;
}

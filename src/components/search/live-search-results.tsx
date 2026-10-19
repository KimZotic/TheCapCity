"use client";

import Link from "next/link";
import type { CollectionSummary, DropSummary, ProductSummary } from "@/lib/commerce/contracts";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { useOperations } from "@/components/commerce/operations-provider";
import { ProductCard } from "@/components/storefront/product-card";
import { productToSummary } from "@/lib/studio/catalog-storage";

export function LiveSearchResults({ query, initialProducts, initialCollections, drops }: { query:string; initialProducts:ProductSummary[]; initialCollections:CollectionSummary[]; drops:DropSummary[] }){
  const {state,hydrated}=useCatalog();
  const {state:operations}=useOperations();
  const normalized=query.trim().toLowerCase();
  const products=hydrated&&normalized?state.products.filter((record)=>record.published&&!record.archived&&[record.product.name,record.product.category,record.product.style,record.product.state].some((value)=>String(value).toLowerCase().includes(normalized))).map((record)=>productToSummary(record.product)):initialProducts;
  const collections=hydrated&&normalized?state.collections.filter((item)=>item.published&&!item.archived&&[item.title,item.shortTitle,item.description,item.kicker].some((value)=>value.toLowerCase().includes(normalized))):initialCollections;
  const liveDrops=hydrated&&normalized?operations.drops.filter((item)=>item.published&&!item.archived&&[item.title,item.kicker,item.description,item.status].some((value)=>String(value).toLowerCase().includes(normalized))):drops;
  const total=products.length+collections.length+liveDrops.length;
  return <>
    {query&&<p className="mt-2 text-[8px] font-semibold text-white/30">{total} result{total===1?"":"s"}</p>}
    {products.length>0&&<section className="mt-7"><div className="flex items-center justify-between"><h2 className="text-[11px] font-bold">Products</h2><span className="text-[8px] text-white/30">{products.length}</span></div><div className="mt-3 grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-4 lg:grid-cols-4">{products.map((product,index)=><ProductCard key={product.id} product={product} index={index}/>)}</div></section>}
    {(collections.length>0||liveDrops.length>0)&&<section className="mt-7 grid gap-3 sm:grid-cols-2">{collections.length>0&&<div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-3"><div className="flex items-center justify-between px-1"><h2 className="text-[10px] font-bold">Collections</h2><span className="text-[8px] text-white/30">{collections.length}</span></div><div className="mt-2">{collections.map((collection)=><Link key={collection.id} href={`/collections/${collection.slug}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-[14px_14px_5px_14px] p-2 hover:bg-white/[.05]"><div className="aspect-square overflow-hidden rounded-[9px_9px_3px_9px] bg-white/8">{collection.image?<img src={collection.image} alt="" className="h-full w-full object-cover"/>:null}</div><div><p className="text-[9px] font-bold">{collection.shortTitle}</p><p className="mt-0.5 text-[7px] text-white/34">{collection.kicker}</p></div><span className="text-white/30">↗</span></Link>)}</div></div>}{liveDrops.length>0&&<div className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-3"><div className="flex items-center justify-between px-1"><h2 className="text-[10px] font-bold">Drops</h2><span className="text-[8px] text-white/30">{liveDrops.length}</span></div><div className="mt-2">{liveDrops.map((drop)=><Link key={drop.id} href={`/drops/${drop.slug}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-[14px_14px_5px_14px] p-2 hover:bg-white/[.05]"><div className="aspect-square overflow-hidden rounded-[9px_9px_3px_9px] bg-white/8">{drop.image?<img src={drop.image} alt="" className="h-full w-full object-cover"/>:null}</div><div><p className="text-[9px] font-bold">{drop.title}</p><p className="mt-0.5 text-[7px] text-white/34">{drop.kicker}</p></div><span className="text-white/30">↗</span></Link>)}</div></div>}</section>}
    {query&&total===0&&<div className="mt-8 rounded-[18px_18px_6px_18px] border border-white/10 bg-white/[.04] p-5 text-[10px] text-white/42">No match. Try KL Legacy, Flat Brim, Fitted or Apparel.</div>}
  </>
}

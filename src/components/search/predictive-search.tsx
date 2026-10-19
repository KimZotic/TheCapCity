"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CollectionSummary, DropSummary, ProductSummary } from "@/lib/commerce/contracts";
import { SearchIcon } from "@/components/icons";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { useOperations } from "@/components/commerce/operations-provider";
import { productToSummary } from "@/lib/studio/catalog-storage";

interface SearchPayload { query: string; products: ProductSummary[]; collections: CollectionSummary[]; drops: DropSummary[]; }
const emptyPayload: SearchPayload = { query: "", products: [], collections: [], drops: [] };
const suggestions = ["KL Legacy", "Flat Brim", "Fitted", "Apparel"];

function LoadingRows() {
  return <div className="grid sm:grid-cols-2">{Array.from({ length: 6 }).map((_,index) => <div key={index} className="flex items-center gap-3 border-b border-white/[.07] px-1 py-3 sm:px-3"><div className="tcc-skeleton h-12 w-12 rounded-[10px_10px_4px_10px]"/><div className="min-w-0 flex-1"><div className="tcc-skeleton h-2.5 w-2/3 rounded-full"/><div className="tcc-skeleton mt-2 h-2 w-1/3 rounded-full"/></div></div>)}</div>;
}

export function PredictiveSearch({ onNavigate }: { onNavigate?: () => void }) {
  const { state: liveCatalog } = useCatalog();
  const { state: operations } = useOperations();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchPayload>(emptyPayload);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) { setData(emptyPayload); setLoading(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search request failed");
        setData(await response.json() as SearchPayload);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setData(emptyPayload);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 160);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query]);

  const normalizedQuery = query.trim().toLowerCase();
  const liveProducts = useMemo(() => normalizedQuery.length < 2 ? [] : liveCatalog.products.filter((record) => record.published && !record.archived && [record.product.name,record.product.category,record.product.style,record.product.state].some((value)=>String(value).toLowerCase().includes(normalizedQuery))).map((record)=>productToSummary(record.product)).slice(0,6), [liveCatalog.products, normalizedQuery]);
  const liveCollections = useMemo(() => normalizedQuery.length < 2 ? [] : liveCatalog.collections.filter((item)=>item.published && !item.archived && [item.title,item.shortTitle,item.description,item.kicker].some((value)=>value.toLowerCase().includes(normalizedQuery))).slice(0,3), [liveCatalog.collections, normalizedQuery]);
  const shownProducts = liveProducts.length || normalizedQuery.length >= 2 ? liveProducts : data.products;
  const shownCollections = liveCollections.length || normalizedQuery.length >= 2 ? liveCollections : data.collections;
  const liveDrops = useMemo(() => normalizedQuery.length < 2 ? [] : operations.drops.filter((item)=>item.published&&!item.archived&&[item.title,item.kicker,item.description,item.status].some((value)=>String(value).toLowerCase().includes(normalizedQuery))).slice(0,3), [operations.drops, normalizedQuery]);
  const shownDrops = normalizedQuery.length >= 2 ? liveDrops : data.drops;
  const resultCount = shownProducts.length + shownCollections.length + shownDrops.length;
  const hasQuery = normalizedQuery.length >= 2;

  return <div>
    <form action="/search" method="get" className="border-b border-white/22">
      <div className="flex min-h-[58px] items-center gap-3"><SearchIcon className="h-4 w-4 shrink-0 text-white/34"/><input ref={inputRef} name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, collections or drops" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-4 text-[15px] font-semibold tracking-[-.02em] text-white outline-none placeholder:text-white/22 sm:text-[17px]"/><button type="submit" className="shrink-0 px-1 py-3 text-[9px] font-semibold text-white/50 transition hover:text-white" aria-label="Submit search">Search ↗</button></div>
    </form>

    {!hasQuery ? <div className="mt-5 grid border-t border-white/[.08] sm:grid-cols-2">{suggestions.map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} onClick={onNavigate} className="flex min-h-12 items-center justify-between border-b border-white/[.08] py-3 text-[10px] font-semibold text-white/58 transition hover:text-white sm:px-3"><span>{term}</span><span className="text-white/22">↗</span></Link>)}</div> : <div className="tcc-scroll mt-4 max-h-[68vh] overflow-y-auto border-t border-white/[.10]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[.08] bg-[#08080a]/96 py-3 backdrop-blur-sm"><p className="text-[8px] font-semibold text-white/42">{loading ? "Searching…" : `${resultCount} result${resultCount === 1 ? "" : "s"}`}</p><Link href={`/search?q=${encodeURIComponent(query.trim())}`} onClick={onNavigate} className="text-[8px] font-semibold text-white/42 transition hover:text-white">View all ↗</Link></div>
      {loading ? <LoadingRows/> : resultCount === 0 ? <p className="py-8 text-[10px] leading-5 text-white/42">No match. Try a product name, fit or collection.</p> : <div className="grid lg:grid-cols-[1.45fr_.55fr]">
        <div className="lg:border-r lg:border-white/[.08] lg:pr-5"><p className="py-3 text-[8px] font-semibold text-white/28">Products</p>{shownProducts.slice(0,6).map((product) => <Link key={product.id} href={`/products/${product.slug}`} onClick={onNavigate} className="group grid grid-cols-[58px_1fr_auto] items-center gap-3 border-b border-white/[.07] py-3 transition"><div className="aspect-square overflow-hidden rounded-[10px_10px_4px_10px] bg-white/[.06]"><img src={product.image ?? ""} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/></div><div className="min-w-0"><p className="truncate text-[10px] font-semibold text-white">{product.name}</p><p className="mt-1 text-[8px] text-white/32">{product.style}</p></div><span className="shrink-0 text-[9px] font-bold text-white">RM{product.price.amount}</span></Link>)}</div>
        <div className="pt-2 lg:pl-5"><p className="py-3 text-[8px] font-semibold text-white/28">Explore</p>{shownCollections.map((collection) => <Link key={collection.id} href={`/collections/${collection.slug}`} onClick={onNavigate} className="group flex items-center gap-3 border-b border-white/[.07] py-3"><div className="h-11 w-11 overflow-hidden rounded-[9px_9px_3px_9px] bg-white/[.06]">{collection.image ? <img src={collection.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/> : null}</div><div className="min-w-0"><p className="truncate text-[9px] font-semibold text-white">{collection.shortTitle}</p><p className="mt-1 text-[7px] text-white/30">Collection</p></div></Link>)}{shownDrops.map((drop) => <Link key={drop.id} href={`/drops/${drop.slug}`} onClick={onNavigate} className="group flex items-center gap-3 border-b border-white/[.07] py-3"><div className="h-11 w-11 overflow-hidden rounded-[9px_9px_3px_9px] bg-white/[.06]">{drop.image ? <img src={drop.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/> : null}</div><div className="min-w-0"><p className="truncate text-[9px] font-semibold text-white">{drop.title}</p><p className="mt-1 text-[7px] text-white/30">{drop.status === "restock" ? "Restock" : "Release"}</p></div></Link>)}</div>
      </div>}
    </div>}
  </div>;
}

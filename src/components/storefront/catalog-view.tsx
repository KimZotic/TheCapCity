"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogData, ProductState } from "@/lib/commerce/contracts";
import { ProductCard } from "@/components/storefront/product-card";
import { CustomSelect } from "@/components/ui/custom-select";
import { useCatalog } from "@/components/commerce/catalog-provider";
import { matchesCatalogCategory, productToSummary } from "@/lib/studio/catalog-storage";

const stateOptions: { label: string; value: "all" | ProductState }[] = [
  { label: "All", value: "all" }, { label: "Latest", value: "new" }, { label: "Limited", value: "limited" }, { label: "Restock", value: "restock" }, { label: "Core", value: "core" }, { label: "Sold out", value: "sold-out" }
];
const sortOptions = [
  { value: "featured", label: "Featured" }, { value: "price-low", label: "Price low" }, { value: "price-high", label: "Price high" }, { value: "name", label: "A–Z" }
] as const;
type SortValue = typeof sortOptions[number]["value"];

export function CatalogView({ catalog, category }: { catalog: CatalogData; category?: string }) {
  const { state: liveCatalog } = useCatalog();
  const [state, setState] = useState<"all" | ProductState>("all");
  const [style, setStyle] = useState("all");
  const [availability, setAvailability] = useState<"all" | "in-stock" | "sold-out">("all");
  const [sort, setSort] = useState<SortValue>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const catalogProducts = useMemo(() => liveCatalog.products.filter((record) => record.published && !record.archived && matchesCatalogCategory(record.product, category)).map((record) => productToSummary(record.product)), [liveCatalog.products, category]);
  const styles = useMemo(() => Array.from(new Set(catalogProducts.map((product) => product.style))), [catalogProducts]);
  const products = useMemo(() => {
    const filtered = catalogProducts.filter((product) => {
      if (state !== "all" && product.state !== state) return false;
      if (style !== "all" && product.style !== style) return false;
      if (availability === "in-stock" && product.totalStock <= 0) return false;
      if (availability === "sold-out" && product.totalStock > 0) return false;
      return true;
    });
    if (sort === "price-low") return [...filtered].sort((a,b) => a.price.amount - b.price.amount);
    if (sort === "price-high") return [...filtered].sort((a,b) => b.price.amount - a.price.amount);
    if (sort === "name") return [...filtered].sort((a,b) => a.name.localeCompare(b.name));
    return filtered;
  }, [catalogProducts, state, style, availability, sort]);

  const activeFilterCount = [state !== "all", style !== "all", availability !== "all"].filter(Boolean).length;
  function clearFilters() { setState("all"); setStyle("all"); setAvailability("all"); }

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (window.innerWidth < 640) return;
      if (!filterRef.current?.contains(event.target as Node)) setFiltersOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setFiltersOpen(false); };
    window.addEventListener("keydown", onKey);
    const shouldLock = window.innerWidth < 640;
    const previousOverflow = document.body.style.overflow;
    if (shouldLock) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (shouldLock) document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);

  return <section className="min-h-[65vh] bg-[#0b0b0d] px-3 py-6 text-white min-[390px]:px-4 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto max-w-[1380px]">
    <header className="border-b border-white/10 pb-5">
      <h1 className="font-display text-[clamp(1.8rem,5vw,2.65rem)] leading-none">{catalog.title}</h1>
    </header>

    <div className="relative mt-4 flex items-center justify-between gap-3" ref={filterRef}>
      <span className="text-[9px] font-semibold text-white/30">{products.length} pieces</span>
      <div className="flex items-center gap-2">
        <button onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className={`tcc-filter-trigger ${filtersOpen || activeFilterCount ? "is-active" : ""}`}><span className="flex items-center gap-2"><svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none"><path d="M3 5h14M6 10h8M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Filter{activeFilterCount ? ` · ${activeFilterCount}` : ""}</span><svg viewBox="0 0 20 20" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} fill="none"><path d="m6.5 8.25 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <CustomSelect value={sort} onChange={setSort} options={[...sortOptions]} label="Sort products"/>
      </div>

      {filtersOpen && <>
        <button aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-[88] bg-black/68 sm:hidden"/>
        <div role="dialog" aria-modal="true" aria-label="Product filters" className="tcc-scroll tcc-filter-popover tcc-safe-bottom">
          <div className="flex items-center justify-between border-b border-black/[.08] pb-4"><div><p className="text-[12px] font-bold">Filters</p><p className="mt-1 text-[8px] text-black/38">{products.length} products match</p></div><button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-[12px] border border-black/10 bg-white text-[15px] transition hover:border-black/25">×</button></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] border border-black/[.07] bg-white p-3"><FilterGroup label="Status" value={state} onChange={(value) => setState(value as typeof state)} options={stateOptions.map((option) => [option.label,option.value] as [string,string])}/></div>
            <div className="rounded-[14px] border border-black/[.07] bg-white p-3"><FilterGroup label="Availability" value={availability} onChange={(value) => setAvailability(value as typeof availability)} options={[["All stock","all"],["In stock","in-stock"],["Sold out","sold-out"]]}/></div>
            <div className="rounded-[14px] border border-black/[.07] bg-white p-3 sm:col-span-2"><FilterGroup label="Style" value={style} onChange={setStyle} options={[["All styles","all"], ...styles.map((value) => [value,value] as [string,string])]}/></div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/[.08] pt-4"><button onClick={clearFilters} className="text-[9px] font-semibold text-black/42 transition hover:text-black">Reset</button><button onClick={() => setFiltersOpen(false)} className="min-h-10 rounded-[12px] bg-black px-5 text-[9px] font-bold text-white">Show {products.length}</button></div>
        </div>
      </>}
    </div>

    <div className="mt-5">{products.length > 0 ? <div className="grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{products.map((product,index) => <ProductCard key={product.id} product={product} index={index}/>)}</div> : <div className="border border-white/10 py-12 text-center"><p className="font-display text-[1.35rem]">No match.</p><button onClick={clearFilters} className="mt-4 min-h-10 border border-white/15 px-4 text-[9px] font-semibold">Clear filters</button></div>}</div>
  </div></section>;
}

function FilterGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string,string][] }) {
  return <div><p className="text-[8px] font-bold uppercase tracking-[.09em] text-black/38">{label}</p><div className="mt-2.5 flex flex-wrap gap-1.5">{options.map(([optionLabel,optionValue]) => <button key={optionValue} type="button" onClick={() => onChange(optionValue)} className={`min-h-9 rounded-full border px-3 text-[8px] font-semibold transition ${value === optionValue ? "border-black bg-black text-white" : "border-black/[.09] bg-[#f8f7f3] text-black/58 hover:border-black/24 hover:text-black"}`}>{optionLabel}</button>)}</div></div>;
}

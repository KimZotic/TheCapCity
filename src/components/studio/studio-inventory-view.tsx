"use client";

import { useMemo, useState } from "react";
import { recalculateProduct, useLiveCatalogState, type InventoryAdjustment } from "@/lib/studio/catalog-storage";
import { StudioSelect } from "@/components/studio/studio-select";
import { useStudioAuth } from "@/components/studio/studio-auth-provider";

const REASONS: InventoryAdjustment["reason"][] = ["restock", "sale-correction", "damage", "return", "count", "other"];
type Filter = "all" | "low" | "out";

export function StudioInventoryView() {
  const { state, update } = useLiveCatalogState();
  const { user } = useStudioAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState<InventoryAdjustment["reason"]>("restock");
  const [note, setNote] = useState("");

  const rows = useMemo(
    () => state.products.filter((record) => !record.archived).flatMap((record) => record.product.variants.map((variant) => ({ record, product: record.product, variant }))),
    [state.products],
  );
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter(({ record, product, variant }) => {
      if (term && ![product.name, variant.sku, variant.color, variant.size].some((value) => value.toLowerCase().includes(term))) return false;
      if (filter === "out" && variant.stock > 0) return false;
      if (filter === "low" && !(variant.stock > 0 && variant.stock <= record.lowStockThreshold)) return false;
      return true;
    });
  }, [rows, filter, query]);

  const selected = rows.find(({ product, variant }) => `${product.id}:${variant.id}` === selectedKey) ?? visible[0] ?? null;
  const lowCount = rows.filter(({ record, variant }) => variant.stock > 0 && variant.stock <= record.lowStockThreshold).length;
  const outCount = rows.filter(({ variant }) => variant.stock <= 0).length;
  const units = rows.reduce((sum, row) => sum + row.variant.stock, 0);

  function applyAdjustment() {
    if (!selected || !delta) return;
    const adjustment: InventoryAdjustment = {
      id: `adj-${Date.now()}`,
      productId: selected.product.id,
      variantId: selected.variant.id,
      delta,
      reason,
      note: note.trim() || undefined,
      staff: user?.displayName ?? "Studio user",
      at: new Date().toISOString(),
    };
    update((current) => ({
      ...current,
      products: current.products.map((record) => {
        if (record.product.id !== selected.product.id) return record;
        const product = recalculateProduct({
          ...record.product,
          variants: record.product.variants.map((variant) => variant.id === selected.variant.id ? { ...variant, stock: Math.max(0, variant.stock + delta) } : variant),
        });
        return { ...record, product, updatedAt: new Date().toISOString() };
      }),
      adjustments: [adjustment, ...current.adjustments].slice(0, 80),
    }));
    setDelta(0);
    setNote("");
  }

  return <div className="studio-page studio-page-flush">
    <div className="mb-3 flex justify-end gap-2">
      <MetricMini value={units} label="Units" />
      <MetricMini value={lowCount} label="Low" tone="amber" />
      <MetricMini value={outCount} label="Out" tone="red" />
    </div>

    <div className="studio-workspace-height grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] xl:items-stretch">
      <section className="studio-card flex min-h-0 flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-black/[.07] p-3 sm:p-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product, SKU or variant" className="studio-input h-10 min-w-[220px] flex-1" />
          <div className="flex gap-1 rounded-[11px] bg-black/[.045] p-1">
            {(["all", "low", "out"] as Filter[]).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-[8px] px-3 py-2 text-[7px] font-bold capitalize ${filter === value ? "bg-white shadow-sm" : "text-black/40"}`}>{value}</button>)}
          </div>
        </div>
        <div className="tcc-scroll min-h-0 flex-1 overflow-auto">
          <div className="min-w-[720px]">
            <div className="sticky top-0 z-[2] grid grid-cols-[2fr_1fr_.8fr_.8fr_.7fr] border-b border-black/[.06] bg-white/95 px-4 py-2 text-[7px] font-bold uppercase tracking-[.08em] text-black/30 backdrop-blur-sm"><span>Product / variant</span><span>SKU</span><span>Available</span><span>Threshold</span><span>Status</span></div>
            {visible.map(({ record, product, variant }) => {
              const key = `${product.id}:${variant.id}`;
              const status = variant.stock <= 0 ? "Out" : variant.stock <= record.lowStockThreshold ? "Low" : "Healthy";
              return <button key={key} onClick={() => setSelectedKey(key)} className={`grid w-full grid-cols-[2fr_1fr_.8fr_.8fr_.7fr] items-center border-b border-black/[.05] px-4 py-3 text-left text-[8px] transition ${selected?.product.id === product.id && selected.variant.id === variant.id ? "bg-[#eef1e9]" : "hover:bg-black/[.02]"}`}>
                <span className="min-w-0"><strong className="block truncate text-[9px]">{product.name}</strong><span className="mt-1 block text-[7px] text-black/35">{variant.color}{variant.size && !["ONE", "OS", "OSFM"].includes(variant.size.toUpperCase()) ? ` · ${variant.size}` : ""}</span></span>
                <span className="font-mono text-[7px] text-black/45">{variant.sku}</span><span className="font-bold">{variant.stock}</span><span>{record.lowStockThreshold}</span>
                <span className={`w-fit rounded-full px-2 py-1 text-[6px] font-bold ${status === "Healthy" ? "bg-[#eaf6e5] text-[#497c35]" : status === "Low" ? "bg-[#fbf0df] text-[#8a6537]" : "bg-[#f9e7e5] text-[#a4483c]"}`}>{status}</span>
              </button>;
            })}
          </div>
        </div>
      </section>

      <div className="flex min-h-0 flex-col gap-4">
        {selected ? <section className="studio-card shrink-0 p-4 sm:p-5">
          <p className="studio-kicker">Adjustment</p><h2 className="mt-2 text-[15px] font-bold">{selected.product.name}</h2><p className="mt-1 text-[8px] text-black/38">{selected.variant.color} · {selected.variant.size} · {selected.variant.sku}</p>
          <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-[13px] bg-[#f4f5f1] p-3"><p className="text-[7px] text-black/35">Current stock</p><p className="mt-1 font-display text-[28px]">{selected.variant.stock}</p></div><div className="rounded-[13px] bg-[#f4f5f1] p-3"><p className="text-[7px] text-black/35">After adjustment</p><p className="mt-1 font-display text-[28px]">{Math.max(0, selected.variant.stock + delta)}</p></div></div>
          <label className="mt-4 block"><span className="studio-field-label">Quantity change</span><div className="grid grid-cols-[42px_1fr_42px] overflow-hidden rounded-[11px] border border-black/10"><button onClick={() => setDelta((v) => v - 1)} className="h-11 bg-[#f7f8f5] text-[15px]">−</button><input inputMode="numeric" value={delta} onChange={(e) => setDelta(Number(e.target.value) || 0)} className="min-w-0 border-x border-black/10 text-center text-[11px] font-bold outline-none"/><button onClick={() => setDelta((v) => v + 1)} className="h-11 bg-[#f7f8f5] text-[15px]">+</button></div></label>
          <label className="mt-3 block"><span className="studio-field-label">Reason</span><StudioSelect value={reason} onChange={setReason} options={REASONS.map((value) => ({ value, label: value.replace("-", " ") }))} label="Adjustment reason" /></label>
          <label className="mt-3 block"><span className="studio-field-label">Note</span><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="studio-input min-h-[70px] resize-none px-3 py-3 leading-5" placeholder="Optional audit note" /></label>
          <button disabled={!delta} onClick={applyAdjustment} className="studio-button mt-4 w-full disabled:opacity-30">Apply adjustment <span>↗</span></button>
        </section> : null}

        <section className="studio-card flex min-h-[220px] flex-1 flex-col overflow-hidden">
          <div className="border-b border-black/[.07] px-4 py-3"><p className="text-[10px] font-bold">Recent adjustments</p></div>
          <div className="tcc-scroll min-h-0 flex-1 overflow-y-auto divide-y divide-black/[.05]">
            {state.adjustments.slice(0, 20).map((item) => { const row = rows.find(({ product, variant }) => product.id === item.productId && variant.id === item.variantId); return <div key={item.id} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-[8px] font-bold">{row?.product.name ?? item.productId}</p><p className="mt-1 text-[7px] text-black/35">{item.reason.replace("-", " ")} · {item.staff ?? "Studio user"} · {new Date(item.at).toLocaleString()}</p></div><span className={`text-[9px] font-bold ${item.delta > 0 ? "text-[#4c8038]" : "text-[#b84c3d]"}`}>{item.delta > 0 ? "+" : ""}{item.delta}</span></div>; })}
            {state.adjustments.length === 0 && <div className="grid h-full min-h-[180px] place-items-center px-4 text-[8px] text-black/35">No adjustments yet.</div>}
          </div>
        </section>
      </div>
    </div>
  </div>;
}

function MetricMini({ value, label, tone = "green" }: { value: number; label: string; tone?: "green" | "amber" | "red" }) {
  const cls = tone === "green" ? "bg-[#edf7e9] text-[#497c35]" : tone === "amber" ? "bg-[#fbf0df] text-[#8a6537]" : "bg-[#f9e7e5] text-[#a4483c]";
  return <div className={`min-w-[70px] rounded-[12px] px-3 py-2 ${cls}`}><p className="text-[13px] font-bold">{value}</p><p className="text-[6px] font-bold uppercase tracking-[.08em] opacity-70">{label}</p></div>;
}

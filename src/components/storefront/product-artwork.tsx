import type { ProductSummary } from "@/lib/commerce/contracts";

export function ProductArtwork({ product, priority = false }: { product: ProductSummary; index?: number; priority?: boolean }) {
  return (
    <div className="tcc-product-stage relative aspect-square overflow-hidden bg-[#e8e6df]">
      {product.image ? (
        <img src={product.image} alt={product.name} loading={priority ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-700 [transition-timing-function:var(--ease-tcc)] group-hover:scale-[1.018]"/>
      ) : (
        <div className="grid h-full place-items-center bg-[#15161a] text-[10px] font-bold tracking-[.12em] text-white">THE CAP CITY</div>
      )}
    </div>
  );
}

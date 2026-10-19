"use client";

import Link from "next/link";
import type { CollectionSummary } from "@/lib/commerce/contracts";
import { useCatalog } from "@/components/commerce/catalog-provider";

export function CollectionCard({ collection: initialCollection }: { collection: CollectionSummary }) {
  const { state } = useCatalog();
  const live = state.collections.find((item) => item.id === initialCollection.id || item.slug === initialCollection.slug);
  if (live && (!live.published || live.archived)) return null;
  const collection = live ?? initialCollection;
  return (
    <Link href={`/collections/${collection.slug}`} className="group relative block min-h-[285px] overflow-hidden rounded-[22px_22px_8px_22px] bg-[#111216] text-white sm:min-h-[330px]">
      {collection.image && <img src={collection.image} alt={collection.title} className="absolute inset-0 h-full w-full object-cover opacity-74 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-84"/>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"/>
      <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5"><div className="flex items-end justify-between gap-4"><div><h2 className="font-display max-w-[14ch] text-[1.65rem] leading-[1] sm:text-[1.9rem]">{collection.title}</h2><p className="mt-2 max-w-[42ch] text-[9px] leading-4 text-white/50">{collection.description}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/24 bg-black/25 text-[13px] transition group-hover:bg-white group-hover:text-black">↗</span></div></div>
    </Link>
  );
}

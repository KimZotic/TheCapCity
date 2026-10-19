"use client";

import type { CollectionSummary } from "@/lib/commerce/contracts";
import { CollectionCard } from "@/components/storefront/collection-card";
import { useCatalog } from "@/components/commerce/catalog-provider";

export function LiveCollectionsGrid({ initialCollections }: { initialCollections: CollectionSummary[] }) {
  const { state, hydrated } = useCatalog();
  const collections = hydrated ? state.collections.filter((item) => item.published && !item.archived) : initialCollections;
  return <div className="mt-4 grid gap-3 lg:grid-cols-2">{collections.map((collection) => <CollectionCard key={collection.id} collection={collection}/>)}</div>;
}

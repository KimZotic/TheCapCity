import type { CatalogData, CollectionDetail, CollectionSummary, DropDetail, DropSummary, HomePageData, ProductDetail, ProductSummary } from "@/lib/commerce/contracts";
import { DemoCommerceRepository } from "@/lib/demo/demo-repository";

const repository = new DemoCommerceRepository();

export async function getHomePageData(): Promise<HomePageData> {
  return repository.getHomePageData();
}

export async function getCatalog(category?: string): Promise<CatalogData> {
  return repository.getCatalog(category);
}

export async function searchProducts(query: string): Promise<ProductSummary[]> {
  return repository.searchProducts(query);
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  return repository.getProduct(slug);
}

export async function getCollections(): Promise<CollectionSummary[]> {
  return repository.getCollections();
}

export async function getCollection(slug: string): Promise<CollectionDetail | null> {
  return repository.getCollection(slug);
}

export async function getDrops(): Promise<DropSummary[]> {
  return repository.getDrops();
}

export async function getDrop(slug: string): Promise<DropDetail | null> {
  return repository.getDrop(slug);
}

import { NextResponse } from "next/server";
import { getCollections, getDrops, searchProducts } from "@/lib/services/commerce-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (query.length < 2) {
    return NextResponse.json({ query, products: [], collections: [], drops: [] });
  }

  const normalized = query.toLowerCase();
  const [products, collections, drops] = await Promise.all([
    searchProducts(query),
    getCollections(),
    getDrops()
  ]);

  return NextResponse.json({
    query,
    products: products.slice(0, 6),
    collections: collections
      .filter((item) => [item.title, item.shortTitle, item.description, item.kicker].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 3),
    drops: drops
      .filter((item) => [item.title, item.kicker, item.description, item.status].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 3)
  });
}

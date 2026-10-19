import type { CatalogData, CollectionDetail, CollectionSummary, CommerceRepository, DropDetail, DropSummary, HomePageData, ProductDetail, ProductSummary } from "@/lib/commerce/contracts";
import { demoCollections, demoDrops, demoHomePageData, demoProductDetails, demoProducts } from "@/lib/demo/data";

const categoryMap: Record<string, { title: string; eyebrow: string; description: string; test: (product: ProductSummary) => boolean }> = {
  "flat-brim": { title: "Flat Brim", eyebrow: "Headwear / Flat Brim", description: "Structured crowns and classic flat-brim profiles.", test: (p) => p.style === "Flat Brim" },
  "curved-brim": { title: "Curved Brim", eyebrow: "Headwear / Curved Brim", description: "Easy curved-brim profiles for everyday rotation.", test: (p) => p.style === "Curved Brim" },
  fitted: { title: "Fitted", eyebrow: "Headwear / Fitted", description: "Size-specific headwear with a precise fit.", test: (p) => p.style === "Fitted" },
  "other-styles": { title: "Other Styles", eyebrow: "Headwear / Other Styles", description: "Alternative headwear profiles beyond the core brim shapes.", test: (p) => p.style === "Other Styles" },
  apparel: { title: "Apparel", eyebrow: "Apparel", description: "TCC apparel across tops, bottoms and future cut-and-sew releases.", test: (p) => p.category === "Apparel" },
  tops: { title: "Tops", eyebrow: "Apparel / Tops", description: "Tees and tops from the current TCC rotation.", test: (p) => p.category === "Apparel" && p.style === "Tops" },
  bottoms: { title: "Bottoms", eyebrow: "Apparel / Bottoms", description: "Bottoms from the wider TCC apparel catalogue.", test: (p) => p.category === "Apparel" && p.style === "Bottoms" },
  special: { title: "Special", eyebrow: "Special", description: "Accessories, bags and utility pieces beyond headwear and apparel.", test: (p) => p.category === "Accessories" },
  "cap-accessories": { title: "Cap Accessories", eyebrow: "Special / Cap Accessories", description: "Pins and small accessories built around the headwear rotation.", test: (p) => p.style === "Cap Accessories" },
  bags: { title: "Bags", eyebrow: "Special / Bags", description: "Carry pieces and utility bags from TCC.", test: (p) => p.style === "Bags" },
  "gift-card": { title: "Gift Card", eyebrow: "Special / Gift Card", description: "Digital TCC gift value for online-store purchases.", test: (p) => p.style === "Gift Card" },
  others: { title: "Others", eyebrow: "Special / Others", description: "Other TCC objects and special releases.", test: (p) => p.style === "Others" },
  headwear: { title: "Headwear", eyebrow: "The Cap City / Headwear", description: "Flat brim, curved brim, fitted and specialist headwear profiles.", test: (p) => p.category === "Headwear" }
};

function productSet(slugs: string[]): ProductSummary[] {
  return slugs.flatMap((slug) => {
    const product = demoProducts.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
}

export class DemoCommerceRepository implements CommerceRepository {
  async getHomePageData(): Promise<HomePageData> { return structuredClone(demoHomePageData); }

  async getCatalog(category?: string): Promise<CatalogData> {
    const entry = category ? categoryMap[category] : undefined;
    const products = entry ? demoProducts.filter(entry.test) : demoProducts;
    return structuredClone({
      title: entry?.title ?? "Shop All",
      eyebrow: entry?.eyebrow ?? "The Cap City / Shop",
      description: entry?.description ?? "Headwear, apparel and special items from the current demo catalogue.",
      products
    });
  }

  async searchProducts(query: string): Promise<ProductSummary[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return structuredClone(demoProducts.filter((product) => [product.name, product.category, product.style, product.state].some((value) => value.toLowerCase().includes(normalized))));
  }

  async getProduct(slug: string): Promise<ProductDetail | null> { return structuredClone(demoProductDetails.find((product) => product.slug === slug) ?? null); }
  async getCollections(): Promise<CollectionSummary[]> { return structuredClone(demoCollections); }
  async getCollection(slug: string): Promise<CollectionDetail | null> {
    const collection = demoCollections.find((item) => item.slug === slug);
    if (!collection) return null;
    return structuredClone({ ...collection, products: productSet(collection.productSlugs) });
  }
  async getDrops(): Promise<DropSummary[]> { return structuredClone(demoDrops); }
  async getDrop(slug: string): Promise<DropDetail | null> {
    const drop = demoDrops.find((item) => item.slug === slug);
    if (!drop) return null;
    const collection = drop.collectionSlug ? demoCollections.find((item) => item.slug === drop.collectionSlug) : undefined;
    return structuredClone({ ...drop, products: productSet(drop.productSlugs), collection });
  }
}

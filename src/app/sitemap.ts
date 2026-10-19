import type { MetadataRoute } from "next";

const base = "https://thecapcity.com";
const routes = ["", "/shop", "/shop/headwear", "/shop/apparel", "/shop/special", "/collections", "/drops", "/payung", "/story", "/support", "/tracking", "/account"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: now, changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly", priority: route === "" ? 1 : route === "/shop" ? .9 : .7 }));
}

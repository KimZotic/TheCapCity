import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductDetailExperience } from "@/components/storefront/product-detail-experience";
import { getCatalog, getProduct } from "@/lib/services/commerce-service";
import { ProductCard } from "@/components/storefront/product-card";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const catalog = await getCatalog(product?.category === "Apparel" ? "apparel" : undefined);
  const related = product ? catalog.products.filter((item) => item.id !== product.id).slice(0,4) : catalog.products.slice(0,4);

  return <main className="bg-[#0b0b0d] text-white">
    <AnnouncementBar /><SiteHeader/>
    <section className="px-3 py-4 min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-6"><div className="mx-auto max-w-[1320px]">
      <div className="mb-3 flex items-center gap-2 text-[8px] font-semibold text-white/32"><Link href="/shop" className="hover:text-white">Shop</Link><span>/</span><span>{product?.style ?? "Product"}</span></div>
      <ProductDetailExperience product={product} slug={slug}/>
    </div></section>
    {related.length > 0 && <section className="bg-[#ecebe6] px-3 py-9 text-black min-[390px]:px-4 sm:px-6 sm:py-11 lg:px-8"><div className="mx-auto max-w-[1320px]"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-[1.5rem] sm:text-[1.8rem]">You may also like.</h2><Link href="/shop" className="text-[9px] font-semibold text-black/42 hover:text-black">Shop all ↗</Link></div><div className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-7 sm:gap-x-4 lg:grid-cols-4">{related.map((item,index) => <ProductCard key={item.id} product={item} index={index}/>)}</div></div></section>}
    <SiteFooter/>
  </main>;
}

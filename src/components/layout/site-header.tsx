"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { useCart } from "@/components/commerce/cart-provider";
import { useAccount } from "@/components/account/account-provider";
import { PredictiveSearch } from "@/components/search/predictive-search";

const primaryNav = [
  ["Headwear", "/shop/headwear"],
  ["Collections", "/collections"],
  ["Drops", "/drops"],
  ["Payung Program", "/payung"],
] as const;

const shopGroups = [
  {
    label: "Headwear",
    links: [
      ["All styles", "/shop/headwear"],
      ["Flat brim", "/shop/flat-brim"],
      ["Curved brim", "/shop/curved-brim"],
      ["Fitted", "/shop/fitted"],
      ["Other styles", "/shop/other-styles"],
    ],
  },
  {
    label: "Apparel",
    links: [
      ["All apparel", "/shop/apparel"],
      ["Tops", "/shop/tops"],
      ["Bottoms", "/shop/bottoms"],
    ],
  },
  {
    label: "Special",
    links: [
      ["Shop special", "/shop/special"],
      ["Cap accessories", "/shop/cap-accessories"],
      ["Bags", "/shop/bags"],
      ["Gift card", "/shop/gift-card"],
      ["Others", "/shop/others"],
    ],
  },
  {
    label: "Collections",
    links: [
      ["KL Legacy", "/collections/kl-legacy"],
      ["City Objects", "/collections/city-objects"],
      ["Fitted Study", "/collections/fitted-study"],
      ["View all", "/collections"],
    ],
  },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { count, openCart } = useCart();
  const { customer } = useAccount();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setShopOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-white/[.09] bg-[#09090a] text-white">
        <div className="mx-auto grid h-[58px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-3 min-[390px]:px-4 sm:h-[64px] sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-8">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setMenuOpen(true)} className="tcc-header-icon lg:hidden" aria-label="Open menu"><MenuIcon className="h-4 w-4"/></button>
            <Link href="/" className="relative hidden h-[31px] w-[54px] lg:block" aria-label="The Cap City home"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill className="object-contain object-left" sizes="54px" priority/></Link>
          </div>

          <Link href="/" className="relative h-[29px] w-[50px] lg:hidden" aria-label="The Cap City home"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill className="object-contain" sizes="50px" priority/></Link>

          <nav className="hidden items-center justify-center gap-7 text-[11px] font-semibold lg:flex" aria-label="Primary navigation">
            <button type="button" className={`nav-link ${shopOpen ? "text-white" : ""}`} aria-haspopup="true" aria-expanded={shopOpen} onClick={() => setShopOpen((value) => !value)} onMouseEnter={() => setShopOpen(true)}>Shop</button>
            {primaryNav.map(([label,href]) => <Link key={href} href={href} className="nav-link" onMouseEnter={() => setShopOpen(false)}>{label}</Link>)}
          </nav>

          <div className="flex items-center justify-end gap-1.5">
            <button onClick={() => { setSearchOpen(true); setShopOpen(false); }} className="tcc-header-icon" aria-label="Search"><SearchIcon className="h-4 w-4"/></button>
            <Link href="/account" className="tcc-header-icon relative" aria-label="Account"><UserIcon className="h-4 w-4"/>{customer && <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-[#d7ff57]"/>}</Link>
            <button type="button" onClick={() => { openCart(); setShopOpen(false); }} className="tcc-header-bag" aria-label={`Open bag with ${count} item${count === 1 ? "" : "s"}`}><BagIcon className="h-4 w-4"/><span className="hidden text-[10px] font-semibold sm:block">Bag</span>{count > 0 && <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#d7ff57] px-1 text-[8px] font-bold text-black">{count}</span>}</button>
          </div>
        </div>

        <div onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)} className={`absolute inset-x-0 top-full border-b border-black/10 bg-[#f3f1ec] text-[#111216] shadow-[0_24px_55px_rgba(0,0,0,.12)] transition-[opacity,transform,visibility] duration-200 ${shopOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
          <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-8 px-8 py-7">
            {shopGroups.map((group) => <div key={group.label}>
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[.12em] text-black/40">{group.label}</p>
              <div className="grid gap-0.5">{group.links.map(([label,href]) => <Link key={href} href={href} onClick={() => setShopOpen(false)} className="group flex min-h-[34px] items-center justify-between border-b border-black/[.06] text-[11px] font-semibold tracking-[-.01em] transition hover:border-black/20"><span>{label}</span><span className="translate-x-[-4px] text-black/22 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">↗</span></Link>)}</div>
            </div>)}
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[80] lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!menuOpen}>
        <button onClick={() => setMenuOpen(false)} aria-label="Close menu overlay" className={`absolute inset-0 bg-black/72 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}/>
        <aside className={`absolute inset-y-0 left-0 flex w-[min(90vw,380px)] flex-col bg-[#09090a] text-white shadow-2xl transition-transform duration-300 [transition-timing-function:var(--ease-tcc)] ${menuOpen ? "translate-x-0" : "-translate-x-[105%]"}`}>
          <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/10 px-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className="relative h-[30px] w-[52px]"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill className="object-contain object-left" sizes="52px"/></Link>
            <button onClick={() => setMenuOpen(false)} className="tcc-header-icon" aria-label="Close menu"><CloseIcon className="h-4 w-4"/></button>
          </div>
          <nav className="tcc-scroll flex-1 overflow-y-auto px-4 pb-6">
            <div className="border-b border-white/10 py-2">
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="flex min-h-[48px] items-center justify-between text-[16px] font-semibold tracking-[-.025em]"><span>Shop all</span><span className="text-white/30">↗</span></Link>
            </div>
            {shopGroups.slice(0,3).map((group) => <div key={group.label} className="border-b border-white/10 py-4">
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[.12em] text-white/32">{group.label}</p>
              <div className="grid grid-cols-2 gap-x-4">{group.links.map(([label,href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-[38px] items-center text-[11px] font-semibold text-white/70">{label}</Link>)}</div>
            </div>)}
            <div className="grid gap-0.5 border-b border-white/10 py-3">{primaryNav.slice(1).map(([label,href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center justify-between text-[13px] font-semibold"><span>{label}</span><span className="text-white/24">↗</span></Link>)}</div>
            <Link href="/account" onClick={() => setMenuOpen(false)} className="mt-4 flex min-h-[46px] items-center justify-between border border-white/10 px-3 text-[11px] font-semibold"><span>{customer ? `Account · ${customer.firstName}` : "Account / Log in"}</span><UserIcon className="h-4 w-4 text-white/45"/></Link>
          </nav>
        </aside>
      </div>

      <div className={`fixed inset-0 z-[90] bg-[#08080a] p-3 transition-opacity sm:p-6 ${searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!searchOpen}>
        <div className={`mx-auto mt-1 max-w-[920px] transition-transform duration-300 [transition-timing-function:var(--ease-tcc)] sm:mt-[5vh] ${searchOpen ? "translate-y-0" : "-translate-y-3"}`}>
          <div className="mb-2 flex justify-end text-white"><button onClick={() => setSearchOpen(false)} className="tcc-header-icon" aria-label="Close search"><CloseIcon className="h-4 w-4"/></button></div>
          {searchOpen && <PredictiveSearch onNavigate={() => setSearchOpen(false)}/>} 
        </div>
      </div>
    </>
  );
}

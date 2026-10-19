"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { StudioIcon, type StudioIconName } from "@/components/studio/studio-icons";
import { StudioLogin } from "@/components/studio/studio-login";
import { StudioWorkspaceSkeleton } from "@/components/studio/studio-skeleton";
import { useStudioAuth } from "@/components/studio/studio-auth-provider";
import { permissionForPath, roleFor, type StudioPermission } from "@/lib/studio/auth";

const sections: { label: string; items: { label: string; href: string; icon: StudioIconName; permission: StudioPermission }[] }[] = [
  { label: "Commerce", items: [
    { label: "Overview", href: "/studio", icon: "overview", permission: "overview" },
    { label: "Orders", href: "/studio/orders", icon: "orders", permission: "orders" },
    { label: "Products", href: "/studio/products", icon: "products", permission: "products" },
    { label: "Collections", href: "/studio/collections", icon: "collections", permission: "collections" },
    { label: "Inventory", href: "/studio/inventory", icon: "inventory", permission: "inventory" },
    { label: "Customers", href: "/studio/customers", icon: "customers", permission: "customers" },
  ]},
  { label: "Growth", items: [
    { label: "Payung Program", href: "/studio/payung", icon: "payung", permission: "payung" },
    { label: "Promotions", href: "/studio/promotions", icon: "promotions", permission: "promotions" },
    { label: "Drops & Events", href: "/studio/drops", icon: "drops", permission: "drops" },
    { label: "Announcements", href: "/studio/announcements", icon: "announcements", permission: "announcements" },
    { label: "Content Studio", href: "/studio/content", icon: "content", permission: "content" },
  ]},
  { label: "Operations", items: [
    { label: "Reports", href: "/studio/reports", icon: "reports", permission: "reports" },
    { label: "Support", href: "/studio/support", icon: "support", permission: "support" },
    { label: "Settings", href: "/studio/settings", icon: "settings", permission: "settings" },
    { label: "Team & Access", href: "/studio/access", icon: "customers", permission: "access" },
  ]},
];

function initials(value?: string) {
  if (!value) return "TC";
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("") || "TC";
}

function NavContent({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  const { has, user } = useStudioAuth();
  const role = user ? roleFor(user.role).label : "";
  return <>
    <div className="px-3 pb-2 pt-4">
      <Link href="/studio" onClick={onNavigate} className="flex h-[42px] items-center gap-3 px-2">
        <span className="relative block h-[27px] w-[46px]"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill sizes="46px" className="object-contain object-left"/></span>
        <span className="h-5 w-px bg-white/10"/>
        <span className="text-[9px] font-semibold tracking-[-.01em] text-white/72">Commerce Studio</span>
      </Link>
    </div>
    <nav className="tcc-scroll flex-1 overflow-y-auto px-2.5 py-2">
      {sections.map((section) => {
        const items = section.items.filter((item) => has(item.permission));
        if (!items.length) return null;
        return <div key={section.label} className="mb-4">
          <p className="mb-1.5 px-2 text-[6px] font-bold uppercase tracking-[.16em] text-white/20">{section.label}</p>
          <div className="grid gap-0.5">{items.map((item) => {
            const active = item.href === "/studio" ? pathname === "/studio" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={onNavigate} className={`group relative flex h-[38px] items-center gap-3 rounded-[10px] px-2.5 text-[8px] font-semibold transition ${active ? "bg-white text-black" : "text-white/48 hover:bg-white/[.045] hover:text-white"}`}>
              <StudioIcon name={item.icon} className={`h-[14px] w-[14px] ${active ? "text-black" : "text-white/30 group-hover:text-white/72"}`}/>
              <span>{item.label}</span>
              {active && <span className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-[#d7ff57] ring-4 ring-[#d7ff57]/10"/>}
            </Link>;
          })}</div>
        </div>;
      })}
    </nav>
    <div className="border-t border-white/[.07] p-3">
      <div className="flex items-center gap-3 rounded-[14px] border border-white/[.06] bg-white/[.035] p-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#d7ff57] text-[9px] font-extrabold text-black">{initials(user?.displayName)}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-[8px] font-bold text-white/88">{user?.displayName}</p><p className="mt-1 text-[6px] text-white/30">{role}</p></div>
      </div>
      <button type="button" onClick={onLogout} className="mt-2 flex h-[38px] w-full items-center gap-3 rounded-[10px] px-3 text-left text-[8px] font-semibold text-white/38 transition hover:bg-white/[.05] hover:text-white">
        <StudioIcon name="logout" className="h-3.5 w-3.5"/><span>Log out</span>
      </button>
    </div>
  </>;
}

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { hydrated, user, has, logout } = useStudioAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const requiredPermission = permissionForPath(pathname);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") setMobileOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hydrated) return <StudioWorkspaceSkeleton/>;
  if (!user) return <StudioLogin/>;
  if (!has(requiredPermission)) return <div className="min-h-screen bg-[#eef0ed] p-5 text-black"><div className="mx-auto mt-16 max-w-xl rounded-[20px] border border-black/8 bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><StudioIcon name="lock" className="h-4 w-4"/></span><div><h1 className="text-[18px] font-bold">Access restricted</h1><p className="mt-1 text-[8px] text-black/42">{roleFor(user.role).label} does not currently have access to this module.</p></div></div><Link href="/studio" className="studio-button-secondary mt-5">Back to overview</Link></div></div>;

  return <div className="studio-root min-h-screen bg-[#eef0ed] text-[#111216]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] flex-col border-r border-white/[.06] bg-[#0b0c0e] text-white lg:flex"><NavContent onLogout={logout}/></aside>
    <div className="lg:pl-[232px]">
      <div className="sticky top-0 z-30 flex h-[54px] items-center border-b border-black/[.07] bg-[#eef0ed]/96 px-3 lg:hidden">
        <button onClick={()=>setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-[10px] border border-black/10 bg-white" aria-label="Open navigation"><MenuIcon className="h-4 w-4"/></button>
        <div className="ml-3 relative h-6 w-10 invert"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill sizes="40px" className="object-contain object-left"/></div>
      </div>
      <main className="min-h-screen">{children}</main>
    </div>

    <div className={`fixed inset-0 z-[70] lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button onClick={()=>setMobileOpen(false)} className={`absolute inset-0 bg-black/60 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} aria-label="Close navigation"/>
      <aside className={`absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-[#0b0c0e] text-white shadow-2xl transition-transform duration-300 [transition-timing-function:var(--ease-tcc)] ${mobileOpen ? "translate-x-0" : "-translate-x-[105%]"}`}>
        <button onClick={()=>setMobileOpen(false)} className="absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center rounded-[9px] border border-white/10 bg-white/[.05]" aria-label="Close"><CloseIcon className="h-4 w-4"/></button>
        <NavContent onNavigate={()=>setMobileOpen(false)} onLogout={logout}/>
      </aside>
    </div>
  </div>;
}

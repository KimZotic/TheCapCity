import type { SVGProps } from "react";

const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export type StudioIconName = "overview" | "orders" | "products" | "collections" | "inventory" | "customers" | "payung" | "promotions" | "drops" | "announcements" | "content" | "reports" | "support" | "settings" | "logout" | "lock" | "archive" | "trash" | "ranking";

export function StudioIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: StudioIconName }) {
  const content = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    orders: <><path d="M6 3h12l2 5-2 13H6L4 8l2-5Z"/><path d="M4 8h16M9 12h6"/></>,
    products: <><path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z"/></>,
    collections: <><rect x="4" y="4" width="11" height="11" rx="2"/><path d="M9 9h11v11H9z"/></>,
    inventory: <><path d="M4 8h16v12H4zM7 4h10l3 4H4l3-4Z"/><path d="M9 13h6"/></>,
    customers: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 15.5A4.5 4.5 0 0 1 21 20"/></>,
    payung: <><path d="M4 11a8 8 0 0 1 16 0H4Z"/><path d="M12 3v15a3 3 0 0 0 6 0"/></>,
    promotions: <><path d="m4 12 8-8h6l2 2v6l-8 8-8-8Z"/><circle cx="16" cy="8" r="1"/><path d="m8 16 8-8"/></>,
    drops: <><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z"/><path d="M9.5 15.5c.7 1 1.5 1.5 2.5 1.5"/></>,
    announcements: <><path d="M4 11h4l8-4v10l-8-4H4v-2Z"/><path d="M8 13v5M19 9l2-2M19 15l2 2"/></>,
    content: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    reports: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    support: <><path d="M5 18.5 3.8 21l3.8-1.35A8.7 8.7 0 1 0 5 18.5Z"/><path d="M8 12h8"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 3.1h5l.4-3.1a8 8 0 0 0 1.7-1l2.4 1 2-3.4L19 13a7 7 0 0 0 0-1Z"/></>,
    logout: <><path d="M10 5H5v14h5"/><path d="M13 8l4 4-4 4M17 12H9"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    archive: <><path d="M4 7h16v13H4z"/><path d="M3 4h18v3H3zM9 12h6"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
    ranking: <><path d="M5 20v-6h4v6M10 20V9h4v11M15 20V4h4v16"/><path d="M3 20h18"/></>,
  }[name];
  return <svg {...base} {...props}>{content}</svg>;
}

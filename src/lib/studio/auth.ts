export type StudioPermission =
  | "overview" | "orders" | "products" | "collections" | "inventory" | "customers"
  | "payung" | "promotions" | "drops" | "announcements" | "content" | "reports"
  | "support" | "settings" | "access";

export type StudioRoleId = "developer" | "owner" | "admin" | "finance" | "merchandising" | "fulfillment" | "support";

export interface StudioRole {
  id: StudioRoleId;
  label: string;
  description: string;
  permissions: StudioPermission[];
  system: boolean;
}

export interface StudioUser {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: StudioRoleId;
  permissionOverrides?: StudioPermission[];
  active: boolean;
}

export const ALL_STUDIO_PERMISSIONS: StudioPermission[] = ["overview","orders","products","collections","inventory","customers","payung","promotions","drops","announcements","content","reports","support","settings","access"];

export const STUDIO_ROLES: StudioRole[] = [
  { id: "developer", label: "Developer", description: "Full system access, architecture and access control.", permissions: ALL_STUDIO_PERMISSIONS, system: true },
  { id: "owner", label: "Owner", description: "Full business access and team permission control.", permissions: ALL_STUDIO_PERMISSIONS, system: true },
  { id: "admin", label: "Admin", description: "Daily commerce operations across catalogue, orders, content and support.", permissions: ["overview","orders","products","collections","inventory","customers","payung","promotions","drops","announcements","content","reports","support","settings"], system: true },
  { id: "finance", label: "Finance", description: "Commercial reporting, order value and customer transaction context.", permissions: ["overview","orders","customers","reports"], system: true },
  { id: "merchandising", label: "Merchandising", description: "Products, inventory, collections, releases and content.", permissions: ["overview","products","collections","inventory","payung","promotions","drops","announcements","content"], system: true },
  { id: "fulfillment", label: "Fulfillment", description: "Order processing, stock operations and service context.", permissions: ["overview","orders","inventory","support"], system: true },
  { id: "support", label: "Support", description: "Customers, order lookup, Payung context and support queue.", permissions: ["overview","orders","customers","payung","support"], system: true },
];

export const DEFAULT_STUDIO_USERS: StudioUser[] = [
  { id: "usr-developer", username: "developer", password: "TCCDev2026!", displayName: "TCC Developer", role: "developer", active: true },
  { id: "usr-owner", username: "owner", password: "TCCOwner2026!", displayName: "TCC Owner", role: "owner", active: true },
  { id: "usr-admin", username: "admin", password: "TCCAdmin2026!", displayName: "Demo Admin", role: "admin", active: true },
  { id: "usr-finance", username: "finance", password: "TCCFinance2026!", displayName: "Finance User", role: "finance", active: true },
];

export function roleFor(id: StudioRoleId) { return STUDIO_ROLES.find((role) => role.id === id) ?? STUDIO_ROLES[2]; }
export function permissionsFor(user: StudioUser) { return user.permissionOverrides ?? roleFor(user.role).permissions; }

export function permissionForPath(pathname: string): StudioPermission {
  if (pathname === "/studio") return "overview";
  if (pathname.startsWith("/studio/orders")) return "orders";
  if (pathname.startsWith("/studio/products")) return "products";
  if (pathname.startsWith("/studio/collections")) return "collections";
  if (pathname.startsWith("/studio/inventory")) return "inventory";
  if (pathname.startsWith("/studio/customers")) return "customers";
  if (pathname.startsWith("/studio/payung")) return "payung";
  if (pathname.startsWith("/studio/promotions")) return "promotions";
  if (pathname.startsWith("/studio/drops")) return "drops";
  if (pathname.startsWith("/studio/announcements")) return "announcements";
  if (pathname.startsWith("/studio/content")) return "content";
  if (pathname.startsWith("/studio/reports")) return "reports";
  if (pathname.startsWith("/studio/support")) return "support";
  if (pathname.startsWith("/studio/settings")) return "settings";
  if (pathname.startsWith("/studio/access")) return "access";
  return "overview";
}

"use client";

import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { SupportLauncher } from "@/components/support/support-launcher";

export function AppChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  return <><CartDrawer /><SupportLauncher /></>;
}

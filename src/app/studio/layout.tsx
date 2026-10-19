import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StudioAuthProvider } from "@/components/studio/studio-auth-provider";
import { StudioProvider } from "@/components/studio/studio-provider";
import { StudioShell } from "@/components/studio/studio-shell";

export const metadata: Metadata = { title: "TCC Commerce Studio — Demo", description: "The Cap City branded commerce management demo." };

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioAuthProvider><StudioProvider><StudioShell>{children}</StudioShell></StudioProvider></StudioAuthProvider>;
}

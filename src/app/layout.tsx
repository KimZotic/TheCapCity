import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/commerce/cart-provider";
import { AccountProvider } from "@/components/account/account-provider";
import { PayungProgramProvider } from "@/components/account/payung-program-provider";
import { AppChrome } from "@/components/layout/app-chrome";
import { CatalogProvider } from "@/components/commerce/catalog-provider";
import { OperationsProvider } from "@/components/commerce/operations-provider";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-tcc-body", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-tcc-display", display: "swap" });

export const metadata: Metadata = {
  title: "The Cap City — Digital Flagship",
  description: "The Cap City fresh rebuild — functional commerce demo.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body><PayungProgramProvider><AccountProvider><CatalogProvider><OperationsProvider><CartProvider>{children}<AppChrome /></CartProvider></OperationsProvider></CatalogProvider></AccountProvider></PayungProgramProvider></body>
    </html>
  );
}

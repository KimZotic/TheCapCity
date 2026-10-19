import type { ShippingAddress } from "@/lib/commerce/contracts";

export const TCC_PICKUP_LOCATION = {
  id: "tcc-flagship-ss15",
  name: "TCC Flagship Store · Main HQ",
  address: "75G, Jalan SS 15/8a, SS15, 47500 Subang Jaya, Selangor, Malaysia",
  note: "Collect after the order is marked ready for pickup."
} as const;

export const SHIPPING_COUNTRIES = [
  "Malaysia",
  "Singapore",
  "Brunei",
  "Indonesia",
  "Thailand",
  "Australia",
  "United Kingdom",
  "United States",
  "International"
] as const;

const eastMalaysia = new Set(["sabah", "sarawak", "labuan", "w.p. labuan", "wilayah persekutuan labuan"]);

export function getDemoDeliveryRate(address: Pick<ShippingAddress, "country" | "state">) {
  const country = address.country.trim().toLowerCase();
  const state = address.state.trim().toLowerCase();
  if (country === "malaysia") return eastMalaysia.has(state) ? 35 : 20;
  if (country === "singapore" || country === "brunei") return 45;
  if (country === "indonesia" || country === "thailand") return 65;
  if (country === "australia") return 85;
  if (country === "united kingdom" || country === "united states") return 110;
  return 120;
}

export function getDeliveryZoneLabel(address: Pick<ShippingAddress, "country" | "state">) {
  if (address.country === "Malaysia") return eastMalaysia.has(address.state.trim().toLowerCase()) ? "East Malaysia" : "Peninsular Malaysia";
  return address.country || "International";
}

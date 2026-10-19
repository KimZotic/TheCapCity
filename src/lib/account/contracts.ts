export type PayungTierId = "black-cup" | "silver-cup" | "gold-cup" | "crown";

export interface DemoAddress {
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

export interface DemoCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  joinedAt: string;
  points: number;
  lifetimeSpend: number;
  redeemedRewardIds: string[];
  defaultAddress?: DemoAddress;
}

export interface PayungTier {
  id: PayungTierId;
  name: string;
  minSpend: number;
  nextSpend?: number;
  note: string;
}

export interface PayungRewardVariant {
  id: string;
  label: string;
  optionLabel?: string;
  optionValue?: string;
  stock: number;
  image?: string;
}

export interface PayungReward {
  id: string;
  slug: string;
  name: string;
  points: number;
  note: string;
  description: string;
  image: string;
  gallery: string[];
  shippingRequired: boolean;
  category: string;
  variants: PayungRewardVariant[];
  details: string[];
}

export interface PayungActivity {
  id: string;
  label: string;
  points: number;
  at: string;
}

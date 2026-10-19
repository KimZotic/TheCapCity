import type { PayungReward, PayungTier } from "@/lib/account/contracts";

export const payungTiers: PayungTier[] = [
  { id: "black-cup", name: "Black Cup", minSpend: 0, nextSpend: 5000, note: "Member access and point earning." },
  { id: "silver-cup", name: "Silver Cup", minSpend: 5000, nextSpend: 30000, note: "2× seasonal points and an upgraded birthday bonus." },
  { id: "gold-cup", name: "Gold Cup", minSpend: 30000, nextSpend: 100000, note: "Birthday gifts, selected events and higher-tier rewards." },
  { id: "crown", name: "Crown", minSpend: 100000, note: "Top-tier status with early access and the strongest member benefits." }
];

const pin = "https://thecapcity.com/cdn/shop/files/Heartbeat_Pin.jpg?v=1783338106&width=1200";
const ring = "https://thecapcity.com/cdn/shop/files/Crest_Ring_Desk.jpg?v=1790061973&width=1200";
const cap = "https://thecapcity.com/cdn/shop/files/KL_Legacy_Cover_Sizing.jpg?v=1759810800&width=1200";
const capDetail = "https://thecapcity.com/cdn/shop/files/KL_Legacy_Classic_Havoc-01.jpg?v=1759810800&width=1200";
const tee = "https://thecapcity.com/cdn/shop/files/TCC_Waving_Flag_Sandstorm_ORG_-_Back.jpg?v=1780021665&width=1200";

export const payungRewards: PayungReward[] = [
  {
    id: "reward-pin",
    slug: "payung-boi-enamel-pin",
    name: "TCC Payung Boi Enamel Pin",
    points: 2500,
    note: "Payung-only collectible.",
    description: "A member reward collectible reserved for the Payung Program reward catalogue.",
    image: pin,
    gallery: [pin],
    shippingRequired: true,
    category: "Collectible",
    variants: [{ id: "pin-standard", label: "Standard", optionLabel: "Edition", optionValue: "Standard", stock: 18, image: pin }],
    details: ["Payung Program exclusive allocation", "Physical reward", "Delivery or flagship pickup"]
  },
  {
    id: "reward-ring",
    slug: "eternal-crest-ring-reward",
    name: "TCC 'The Eternal' Crest Ring",
    points: 6500,
    note: "Reward allocation with selectable sizing.",
    description: "A special-item reward allocation. Choose the available ring size before adding it to the Payung bag.",
    image: ring,
    gallery: [ring],
    shippingRequired: true,
    category: "Special",
    variants: [
      { id: "ring-us7", label: "US7", optionLabel: "Size", optionValue: "US7", stock: 4, image: ring },
      { id: "ring-us9", label: "US9", optionLabel: "Size", optionValue: "US9", stock: 3, image: ring }
    ],
    details: ["Reward-only allocation", "Selectable ring size", "Delivery or flagship pickup"]
  },
  {
    id: "reward-cap",
    slug: "kl-legacy-classic-reward",
    name: "KL Legacy Classic Snapback — Payung Allocation",
    points: 9000,
    note: "Dedicated Payung reward stock, separate from retail inventory.",
    description: "A Payung-only allocation of the KL Legacy Classic Snapback. Reward inventory is managed independently from the normal storefront catalogue.",
    image: cap,
    gallery: [cap, capDetail],
    shippingRequired: true,
    category: "Headwear",
    variants: [
      { id: "reward-cap-black", label: "Classic Black", optionLabel: "Colour", optionValue: "Classic Black", stock: 5, image: cap },
      { id: "reward-cap-navy", label: "Navy", optionLabel: "Colour", optionValue: "Navy", stock: 3, image: cap },
      { id: "reward-cap-khaki", label: "Khaki", optionLabel: "Colour", optionValue: "Khaki", stock: 2, image: cap }
    ],
    details: ["Payung reward inventory", "Adjustable snapback", "Reward colour allocation may differ from retail stock"]
  },
  {
    id: "reward-payung-tee",
    slug: "payung-tee-reward",
    name: "TCC Payung Tee",
    points: 12000,
    note: "Member-only apparel reward.",
    description: "A dedicated Payung Program apparel reward with its own sizes and reward inventory.",
    image: tee,
    gallery: [tee],
    shippingRequired: true,
    category: "Apparel",
    variants: [
      { id: "reward-tee-s", label: "S", optionLabel: "Size", optionValue: "S", stock: 3, image: tee },
      { id: "reward-tee-m", label: "M", optionLabel: "Size", optionValue: "M", stock: 5, image: tee },
      { id: "reward-tee-l", label: "L", optionLabel: "Size", optionValue: "L", stock: 5, image: tee },
      { id: "reward-tee-xl", label: "XL", optionLabel: "Size", optionValue: "XL", stock: 2, image: tee }
    ],
    details: ["Payung Program exclusive reward", "Selectable apparel size", "Delivery or flagship pickup"]
  }
];

export const payungEarnMethods = [
  { id: "purchase", value: "3 points per RM1", label: "Make a purchase", icon: "money" },
  { id: "join", value: "25 points", label: "Join Payung Program", icon: "member" },
  { id: "birthday", value: "50 points", label: "Birthday points", icon: "birthday" },
  { id: "instagram", value: "25 points", label: "Follow on Instagram", icon: "instagram" },
  { id: "tiktok", value: "25 points", label: "Follow on TikTok", icon: "tiktok" },
  { id: "facebook", value: "25 points", label: "Like on Facebook", icon: "facebook" },
  { id: "mail", value: "25 points", label: "Join the mailing list", icon: "mail" }
] as const;

export const payungTierBenefits = [
  { label: "Accumulated spend", values: ["RM0 – 4,999", "RM5,000 – 29,999.99", "RM30,000 – 99,999.99", "RM100,000 & above"] },
  { label: "Birthday bonus points", values: ["50", "300", "1,000", "1,500"] },
  { label: "2× points multiplier · selected season", values: [false, true, true, true] },
  { label: "Birthday gift · product", values: [false, false, true, true] },
  { label: "Exclusive event invitation", values: [false, false, true, true] },
  { label: "Early access to new release", values: [false, false, false, true] }
] as const;

export const payungFaqs = [
  ["How do I earn points?", "Earn 3 Payung Points for every RM1 spent on eligible online-store and flagship-store purchases. Points are non-transferable and are not cash."],
  ["Why can’t I redeem the same item again?", "Each eligible redemption item can only be claimed once per account in the current Payung rules."],
  ["When will I see points after an order?", "Points are added after the order is completed. The demo updates the linked member account when a checkout uses the same email."],
  ["How can I check my points balance?", "Log in to your TCC account and open Payung Program to see the current balance and activity."],
  ["Do Payung Points expire?", "Current Payung rules state that points expire after 6 months of inactivity. A qualifying purchase or redemption keeps the balance active."],
  ["Does my tier status expire?", "Tier status can drop after 12 months of inactivity. Staying active through eligible earning or redemption keeps membership current."],
  ["When will I receive birthday points?", "Add your birthdate to the account profile. If the birthday has already passed for the current cycle, the bonus is applied the following year."],
  ["Do older purchases count?", "Current Payung guidance counts eligible direct TCC purchases from 2024 for points, while tier progress uses eligible spend from 2025."]
] as const;

export function getPayungTier(spend: number) {
  return [...payungTiers].reverse().find((tier) => spend >= tier.minSpend) ?? payungTiers[0];
}

export function getPayungReward(slug: string) {
  return payungRewards.find((reward) => reward.slug === slug) ?? null;
}

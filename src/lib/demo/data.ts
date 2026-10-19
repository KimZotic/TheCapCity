import type { CategorySummary, CollectionSummary, DropSummary, EditorialTile, HomePageData, ProductDetail, ProductSummary, ProductVariant } from "@/lib/commerce/contracts";

function makeVariants(prefix: string, colors: string[], sizes: string[], stocks: number[]): ProductVariant[] {
  let index = 0;
  return colors.flatMap((color) => sizes.map((size) => {
    const stock = stocks[index % stocks.length] ?? 0;
    index += 1;
    return {
      id: `${prefix}-${color.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${size.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      sku: `${prefix.toUpperCase()}-${String(index).padStart(2, "0")}`,
      color,
      size,
      stock
    };
  }));
}

const media = {
  hero: "https://thecapcity.com/cdn/shop/files/144P_anner_desk.jpg?v=1774858602&width=1800",
  classic: "https://thecapcity.com/cdn/shop/files/KL_Legacy_Cover_Sizing.jpg?v=1759810800&width=1600",
  classicDetail: "https://thecapcity.com/cdn/shop/files/KL_Legacy_Classic_Havoc-01.jpg?v=1759810800&width=1800",
  classicRed: "https://cdn.store-assets.com/s/1327290/i/75804365.jpeg",
  foreverLifestyle: "https://thecapcity.com/cdn/shop/files/Snapinst.app_474886423_18488021281034253_3262692847795330647_n_1080.jpg?v=1737967597&width=1080",
  trucker: "https://thecapcity.com/cdn/shop/files/KLTruckerCover-24_b922b813-1289-4580-8386-93fe934f76d0.jpg?v=1738589279&width=1600",
  truckerClassicBlack: "https://thecapcity.com/cdn/shop/files/KLTrucker45.jpg?v=1765347261&width=1600",
  truckerGroup: "https://thecapcity.com/cdn/shop/files/7_9_Item_Cover_Sizing-63.jpg?v=1788444547&width=1600",
  truckerDetailClassicBlack: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-06_e0194f97-7150-4148-a008-696fa928d11e.jpg?v=1788444569&width=1600",
  truckerDetailBrown: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-02.jpg?v=1788444566&width=1600",
  truckerDetailBlack: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-01.jpg?v=1788444568&width=1600",
  truckerDetailGreen: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-03.jpg?v=1788444569&width=1600",
  truckerDetailNavy: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-04.jpg?v=1788444570&width=1600",
  truckerDetailPink: "https://thecapcity.com/cdn/shop/files/KL_Trucker_Havoc-05.jpg?v=1788444569&width=1600",
  truckerTwoToneCream: "https://thecapcity.com/cdn/shop/files/KL2-toneTruckerBL45.jpg?v=1765347261&width=1600",
  truckerBlackOnBlack: "https://thecapcity.com/cdn/shop/files/KLBOBTrucker45.jpg?v=1765347261&width=1600",
  truckerBlack: "https://thecapcity.com/cdn/shop/files/KLTruckerBL45.jpg?v=1765347261&width=1600",
  truckerBrown: "https://thecapcity.com/cdn/shop/files/KLTruckerBR45.jpg?v=1765347261&width=1600",
  truckerGreen: "https://thecapcity.com/cdn/shop/files/KLTruckerGR45.jpg?v=1765347261&width=1600",
  truckerNavy: "https://thecapcity.com/cdn/shop/files/KLTruckerNV45.jpg?v=1765347261&width=1600",
  truckerPink: "https://thecapcity.com/cdn/shop/files/KLTruckerPK45.jpg?v=1765347261&width=1600",
  paisley: "https://thecapcity.com/cdn/shop/files/JCATPDecemberHavoc-03.jpg?v=1765278854&width=720",
  fitted: "https://thecapcity.com/cdn/shop/files/KLFittedCover-08_5def4d79-54e3-4a09-a10e-43e284cd8813.jpg?v=1768207057&width=1600",
  fittedDetail: "https://thecapcity.com/cdn/shop/files/KLFittedHavocPost-04_6369abbb-16c4-4f94-b88a-94fd1e300d60.jpg?v=1768207057&width=1800",
  roll: "https://cdn.store-assets.com/s/1327290/i/77730996.jpeg",
  tote: "https://thecapcity.com/cdn/shop/files/MonogramToteBagFront.jpg?v=1754539474&width=1080",
  toteLifestyle: "https://thecapcity.com/cdn/shop/files/SnapInsta.to_528402220_18525292090034253_3862574897883795951_n.jpg?v=1754539474&width=1800",
  tee: "https://thecapcity.com/cdn/shop/files/TCC_Waving_Flag_Sandstorm_ORG_-_Back.jpg?v=1780021665&width=1080",
  malaya: "https://thecapcity.com/cdn/shop/files/FittedHavoc-05.jpg?v=1765376410&width=1100",
  bunga: "https://thecapcity.com/cdn/shop/files/KLFittedRDHavoc-02.jpg?v=1778142235&width=1600",
  hikari: "https://thecapcity.com/cdn/shop/files/TCCxHikariHavoc-04.jpg?v=1739371716&width=1800",
  payung: "https://thecapcity.com/cdn/shop/files/KLFittedRDHavoc-01.jpg?v=1778142186&width=1600",
  pants: "https://thecapcity.com/cdn/shop/files/MonogramDoubleKneePantsFront.jpg?v=1788442807&width=1600",
  pantsGroup: "https://thecapcity.com/cdn/shop/files/7_9_Item_Cover_Sizing-66.jpg?v=1788442872&width=1600",
  crestRing: "https://thecapcity.com/cdn/shop/files/Crest_Ring_Desk.jpg?v=1790061973&width=1600",
  enamelPin: "https://thecapcity.com/cdn/shop/files/Heartbeat_Pin.jpg?v=1783338106&width=1600",
  giftCard: "https://thecapcity.com/cdn/shop/files/Gift_Card_Flatlay-01.jpg?v=1742533890&width=1600"
} as const;

export const demoProductDetails: ProductDetail[] = [
  {
    id: "p-001", slug: "kl-legacy-classic", name: "KL Legacy Classic Snapback", price: { amount: 165, currency: "MYR" }, state: "restock", category: "Headwear", style: "Flat Brim", accent: "ink", totalStock: 17, image: media.classic,
    gallery: [media.classic, media.classicRed, media.classicDetail, media.foreverLifestyle],
    colorMedia: {
      "Classic Black": [media.classic, media.classicDetail, media.foreverLifestyle],
      "Black on Black": [media.classicDetail, media.classic, media.foreverLifestyle],
      "Maroon": [media.classicRed, media.classic, media.classicDetail],
      "Navy": [media.classic, media.classicDetail, media.hero]
    },
    description: "The signature KL Legacy profile: structured crown, flat brim and clean 3D embroidery made for everyday rotation.",
    material: "Premium cotton", fit: "Classic-Fit / one size fits most", closure: "Adjustable snapback", brim: "Flat brim", payungPoints: 165,
    details: ["Structured crown with 3D KL embroidery", "TCC woven flag label", "Moisture-absorbing interior sweatband", "Each cap comes with a TCC display box"],
    variants: makeVariants("klc", ["Classic Black", "Black on Black", "Maroon", "Navy"], ["OSFM"], [7, 4, 3, 3])
  },
  {
    id: "p-002", slug: "kl-legacy-puffy-trucker", name: "KL Legacy Puffy Trucker Snapback", price: { amount: 165, currency: "MYR" }, state: "new", category: "Headwear", style: "Curved Brim", accent: "olive", totalStock: 29, image: media.truckerGroup,
    gallery: [media.truckerGroup, media.truckerClassicBlack, media.truckerDetailClassicBlack],
    colorMedia: {
      "Classic Black": [media.truckerClassicBlack, media.truckerDetailClassicBlack, media.truckerGroup],
      "Black": [media.truckerBlack, media.truckerDetailBlack, media.truckerGroup],
      "Navy": [media.truckerNavy, media.truckerDetailNavy, media.truckerGroup],
      "Green": [media.truckerGreen, media.truckerDetailGreen, media.truckerGroup],
      "Brown": [media.truckerBrown, media.truckerDetailBrown, media.truckerGroup],
      "Pink": [media.truckerPink, media.truckerDetailPink, media.truckerGroup],
      "2-TONE BL/CR": [media.truckerTwoToneCream, media.truckerGroup, media.truckerDetailClassicBlack],
      "Black on Black": [media.truckerBlackOnBlack, media.truckerDetailBlack, media.truckerGroup]
    },
    description: "A lighter KL Legacy trucker with a pinch-front crown, curved brim and breathable mesh back.",
    material: "Premium cotton / mesh", fit: "A-Fit / one size fits most", closure: "Adjustable 7-hole snapback", brim: "Curved brim", payungPoints: 165,
    details: ["Pinch-front crown", "KL embroidery", "Breathable mesh rear", "Adjustable 7-hole snapback closure"],
    variants: makeVariants("klt", ["Classic Black", "Black", "Navy", "Green", "Brown", "Pink", "2-TONE BL/CR", "Black on Black"], ["OSFM"], [4, 4, 4, 4, 4, 3, 3, 3])
  },
  {
    id: "p-003", slug: "kl-legacy-paisley", name: "KL Legacy Paisley Classic Snapback", price: { amount: 185, currency: "MYR" }, state: "limited", category: "Headwear", style: "Flat Brim", accent: "signal", totalStock: 9, image: media.paisley,
    gallery: [media.paisley, media.classic, media.foreverLifestyle],
    description: "KL Legacy reworked with paisley embroidery across the crown and brim for a sharper collectible finish.",
    material: "Premium cotton", fit: "Classic-Fit / one size fits most", closure: "Adjustable snapback", brim: "Flat brim", payungPoints: 185,
    details: ["KL 3D embroidery", "Paisley embroidery around crown and brim", "Grey underbrim", "TCC woven flag and inner labels"],
    variants: makeVariants("klp", ["Black", "Red", "Blue"], ["OSFM"], [4, 3, 2])
  },
  {
    id: "p-004", slug: "kl-legacy-fitted", name: "KL Legacy Fitted Cap Collection", price: { amount: 215, currency: "MYR" }, state: "core", category: "Headwear", style: "Fitted", accent: "blue", totalStock: 16, image: media.fitted,
    gallery: [media.fitted, media.fittedDetail, media.malaya],
    description: "The KL Legacy language in a size-specific fitted build with a clean closed-back silhouette.",
    material: "Premium polyester", fit: "Fitted / size specific", closure: "Closed back", brim: "Flat brim", payungPoints: 215,
    details: ["Structured crown", "3D KL embroidery", "Kuala Lumpur side embroidery", "Kelly green underbrim on selected colourways"],
    variants: makeVariants("klf", ["Black", "Red", "Green", "Navy"], ["7", "7 1/4", "7 1/2", "7 3/4"], [2, 1, 2, 1, 1, 2, 1, 1])
  },
  {
    id: "p-005", slug: "roll-cap", name: "The Cap City Roll Cap Collection", price: { amount: 145, currency: "MYR" }, state: "new", category: "Headwear", style: "Other Styles", accent: "stone", totalStock: 14, image: media.roll,
    gallery: [media.roll, media.hero, media.toteLifestyle],
    description: "A brimless roll-cap profile with an unstructured crown and compact TCC flag detail.",
    material: "Cotton blend", fit: "Close / unstructured", closure: "Pull-on", brim: "Brimless", payungPoints: 145,
    details: ["Unstructured crown", "Rolled edge", "TCC flag label", "Moisture-absorbing interior sweatband"],
    variants: makeVariants("roll", ["Black", "Khaki", "Olive"], ["OSFM"], [5, 5, 4])
  },
  {
    id: "p-006", slug: "monogram-tote", name: "TCC Double Pocket Monogram Tote", price: { amount: 185, currency: "MYR" }, state: "new", category: "Accessories", style: "Bags", accent: "ink", totalStock: 7, image: media.tote,
    gallery: [media.tote, media.toteLifestyle, media.tee],
    description: "A roomy daily tote with TCC graphic branding, checkerboard monogram detail and utility-focused carry space.",
    material: "Heavy canvas", fit: "One size", closure: "Zip top", brim: "Not applicable", payungPoints: 185,
    details: ["Large carry format", "Monogram utility pocket", "TCC graphic embroidery", "Top handles and shoulder carry"],
    variants: makeVariants("tote", ["Natural / Black"], ["OS"], [7])
  },
  {
    id: "p-007", slug: "waving-flag-sandstorm-tee", name: "TCC Waving Flag Sandstorm Tee", price: { amount: 165, currency: "MYR" }, state: "core", category: "Apparel", style: "Tops", accent: "signal", totalStock: 26, image: media.tee,
    gallery: [media.tee, media.hero, media.toteLifestyle],
    description: "A relaxed black tee carrying the TCC waving-flag graphic in a sandstorm orange finish.",
    material: "Cotton jersey", fit: "Relaxed fit", closure: "Pull-on", brim: "Not applicable", payungPoints: 165,
    details: ["Relaxed silhouette", "Large back graphic", "TCC woven detail", "Unisex demo sizing"],
    variants: makeVariants("tee", ["Black / Orange"], ["S", "M", "L", "XL"], [4, 8, 8, 6])
  },
  {
    id: "p-008", slug: "malaya-fitted", name: "TCC Malaya Fitted Cap", price: { amount: 285, currency: "MYR" }, state: "restock", category: "Headwear", style: "Fitted", accent: "olive", totalStock: 13, image: media.malaya,
    gallery: [media.malaya, media.fitted, media.fittedDetail],
    description: "A black fitted cap with turquoise Malaya embroidery and cross-panel cultural detailing.",
    material: "Premium polyester", fit: "Fitted / size specific", closure: "Closed back", brim: "Flat brim", payungPoints: 285,
    details: ["Malaya 3D embroidery", "Turquoise underbrim", "Cross-panel embroidery", "TCC Infinity logo at back"],
    variants: makeVariants("malaya", ["Black / Turquoise"], ["7", "7 1/4", "7 1/2", "7 3/4", "8"], [3, 3, 3, 2, 2])
  },
  {
    id: "p-009", slug: "bunga-raya-fitted", name: "KL Legacy Bunga Raya Fitted Cap", price: { amount: 285, currency: "MYR" }, state: "sold-out", category: "Headwear", style: "Fitted", accent: "ink", totalStock: 0, image: media.bunga,
    gallery: [media.bunga, media.payung, media.fittedDetail],
    description: "A fitted KL Legacy profile with Bunga Raya embroidery across the crown and brim.",
    material: "Premium polyester", fit: "Fitted / size specific", closure: "Closed back", brim: "Flat brim", payungPoints: 285,
    details: ["Bunga Raya embroidery", "Kelly green underbrim", "KL 3D front embroidery", "Sold-out demo state"],
    variants: makeVariants("bunga", ["Red"], ["7", "7 1/4", "7 1/2", "7 3/4", "8"], [0])
  },
  {
    id: "p-010", slug: "monogram-double-knee-pants", name: "TCC Monogram Double Knee Pants", price: { amount: 350, currency: "MYR" }, state: "new", category: "Apparel", style: "Bottoms", accent: "stone", totalStock: 18, image: media.pants,
    gallery: [media.pants, media.pantsGroup, media.toteLifestyle],
    description: "Washed cotton double-knee pants with a straight silhouette, utility pockets and TCC monogram detailing.",
    material: "100% cotton / 390gsm", fit: "Straight cut", closure: "Zip button fly / drawstring waist", brim: "Not applicable", payungPoints: 350,
    details: ["Double-knee monogram panels", "Cargo pocket design", "TCC leather patch", "Washed sand-brush finish"],
    variants: makeVariants("pants", ["Pants"], ["S", "M", "L", "XL", "2XL"], [3, 5, 5, 3, 2])
  },
  {
    id: "p-011", slug: "the-eternal-crest-ring", name: "TCC 'The Eternal' Crest Ring", price: { amount: 165, currency: "MYR" }, state: "new", category: "Accessories", style: "Others", accent: "ink", totalStock: 8, image: media.crestRing,
    gallery: [media.crestRing, media.toteLifestyle],
    description: "A stainless-steel TCC crest ring designed as a compact everyday object from the current special-item rotation.",
    material: "Stainless steel", fit: "Ring sizing", closure: "Not applicable", brim: "Not applicable", payungPoints: 165,
    details: ["TCC crest form", "Stainless-steel construction", "Polished silver finish", "Special-item release"],
    variants: makeVariants("ring", ["Silver"], ["US7", "US9"], [4, 4])
  },
  {
    id: "p-012", slug: "greatest-enamel-pin", name: "TCC Greatest Enamel Pin Collection", price: { amount: 29, currency: "MYR" }, state: "core", category: "Accessories", style: "Cap Accessories", accent: "signal", totalStock: 18, image: media.enamelPin,
    gallery: [media.enamelPin, media.classicDetail],
    description: "Hard-enamel TCC pins made to add a small hit of character to caps, bags and everyday pieces.",
    material: "Hard enamel / metal", fit: "Accessory", closure: "Rubber brooch pin back", brim: "Not applicable", payungPoints: 29,
    details: ["Hard enamel pin", "Multi-colour front", "Rubber brooch pin back", "Affixed card back"],
    variants: makeVariants("pin", ["HEARTBEAT PIN", "KL LEGACY PIN", "S-WAVE PIN"], ["ONE"], [7, 6, 5])
  },
  {
    id: "p-013", slug: "tcc-gift-card", name: "TCC Gift Card", price: { amount: 100, currency: "MYR" }, state: "core", category: "Accessories", style: "Gift Card", accent: "ink", totalStock: 999, image: media.giftCard,
    gallery: [media.giftCard],
    colorMedia: { "RM 100": [media.giftCard], "RM 200": [media.giftCard], "RM 300": [media.giftCard] },
    description: "Digital TCC gift value for online-store purchases, delivered as a unique redeemable code after purchase.",
    material: "Digital e-gift card", fit: "Digital delivery", closure: "Unique code", brim: "Not applicable", payungPoints: 100,
    details: ["Redeemable on the TCC online store", "Valid across eligible online products", "6-month validity from purchase", "Remaining balance stays valid until expiry"],
    variants: [
      { id: "gift-rm100", sku: "GIFT-100", color: "RM 100", size: "Digital", stock: 999, priceOverride: 100 },
      { id: "gift-rm200", sku: "GIFT-200", color: "RM 200", size: "Digital", stock: 999, priceOverride: 200 },
      { id: "gift-rm300", sku: "GIFT-300", color: "RM 300", size: "Digital", stock: 999, priceOverride: 300 }
    ]
  }
];

export const demoProducts: ProductSummary[] = demoProductDetails.map(({ description: _description, material: _material, fit: _fit, closure: _closure, brim: _brim, payungPoints: _payungPoints, variants: _variants, details: _details, gallery: _gallery, colorMedia: _colorMedia, ...summary }) => summary);

export const demoCategories: CategorySummary[] = [
  { id: "c-01", label: "Headwear", href: "/shop/headwear", kicker: "Flat brim · curved brim · fitted · other styles", index: "01" },
  { id: "c-02", label: "Apparel", href: "/shop/apparel", kicker: "Tops · bottoms", index: "02" },
  { id: "c-03", label: "Special", href: "/shop/special", kicker: "Accessories · bags · gift card · others", index: "03" },
  { id: "c-04", label: "Collections", href: "/collections", kicker: "Collaborations · drops · TCC stories", index: "04" }
];

export const editorialTiles: EditorialTile[] = [
  { id: "e-01", eyebrow: "KL / 01", title: "Made around the city.", copy: "Kuala Lumpur stays visible through product, styling and collaboration.", treatment: "mono", image: media.hero },
  { id: "e-02", eyebrow: "DETAIL / 02", title: "Look closer.", copy: "Fit, embroidery and finish deserve their own moment.", treatment: "paper", image: media.foreverLifestyle },
  { id: "e-03", eyebrow: "OBJECT / 03", title: "Beyond the cap.", copy: "Apparel and utility pieces move in the same TCC world.", treatment: "signal", image: media.toteLifestyle }
];

export const demoHomePageData: HomePageData = {
  announcement: "TCC ONLINE FLAGSHIP · DELIVERY + STORE PICKUP",
  ticker: ["New release", "KL Legacy", "Headwear", "Drops", "Payung Program"],
  hero: {
    id: "hero-001",
    eyebrow: "The Cap City / Kuala Lumpur",
    title: "Wear the city.",
    copy: "Headwear first. New drops, fitted profiles and KL-built staples.",
    cta: "Shop new rotation",
    href: "/shop",
    tone: "ink",
    image: media.hero
  },
  latestDrop: demoProducts.slice(0, 4),
  categories: demoCategories,
  editorial: {
    id: "editorial-01",
    eyebrow: "The Cap City",
    title: "Built around headwear. Grown into a culture.",
    copy: "A sharper digital home for TCC product, city stories and new releases.",
    cta: "Our story",
    href: "/story",
    tone: "signal",
    image: media.toteLifestyle
  },
  editorialTiles
};

export const demoCollections: CollectionSummary[] = [
  {
    id: "col-001", slug: "kl-legacy", title: "KL Legacy", shortTitle: "KL Legacy",
    description: "The core KL language across classic, trucker and fitted profiles.", kicker: "Kuala Lumpur / core", tone: "ink",
    productSlugs: ["kl-legacy-classic", "kl-legacy-puffy-trucker", "kl-legacy-paisley", "kl-legacy-fitted"], featured: true, image: media.foreverLifestyle
  },
  {
    id: "col-002", slug: "city-objects", title: "City Objects", shortTitle: "City Objects",
    description: "Caps, apparel and utility pieces selected as a compact city uniform.", kicker: "Apparel / accessories", tone: "signal",
    productSlugs: ["monogram-tote", "waving-flag-sandstorm-tee", "monogram-double-knee-pants", "the-eternal-crest-ring", "roll-cap"], featured: true, image: media.toteLifestyle
  },
  {
    id: "col-003", slug: "fitted-study", title: "Fitted Study", shortTitle: "Fitted Study",
    description: "Size-specific silhouettes with stronger embroidery and collectible detailing.", kicker: "Fitted / size specific", tone: "olive",
    productSlugs: ["kl-legacy-fitted", "malaya-fitted", "bunga-raya-fitted"], featured: false, image: media.malaya
  }
];

export const demoDrops: DropSummary[] = [
  {
    id: "drop-001", slug: "kl-legacy-weekend", title: "KL Legacy Weekend", kicker: "Upcoming drop",
    description: "A tight KL Legacy edit built around classic, trucker and fitted profiles.", status: "upcoming",
    releaseAt: "2026-11-07T12:00:00+08:00", collectionSlug: "kl-legacy",
    productSlugs: ["kl-legacy-classic", "kl-legacy-puffy-trucker", "kl-legacy-paisley"], tone: "blue", image: media.hero
  },
  {
    id: "drop-002", slug: "city-objects-live", title: "City Objects", kicker: "Live now",
    description: "Apparel and utility pieces live beside headwear in one compact release story.", status: "live",
    releaseAt: "2026-10-16T12:00:00+08:00", collectionSlug: "city-objects",
    productSlugs: ["monogram-tote", "waving-flag-sandstorm-tee", "roll-cap"], tone: "signal", image: media.toteLifestyle
  },
  {
    id: "drop-003", slug: "fitted-restock", title: "Fitted Restock", kicker: "Restock",
    description: "A fitted-focused restock with KL Legacy and Malaya profiles back in rotation.", status: "restock",
    releaseAt: "2026-10-12T12:00:00+08:00", collectionSlug: "fitted-study",
    productSlugs: ["kl-legacy-fitted", "malaya-fitted"], tone: "olive", image: media.malaya
  }
];

# TCC DESIGN SYSTEM — v0.7

## Direction
**TCC Neo Flagship**

A dark-lux, modern Gen Z fashion system built around real TCC product/campaign photography, compact commerce hierarchy, controlled spatial motion and a distinctive soft-cut geometry. It must feel like a digital fashion flagship — not skincare, beauty, SaaS, hip-hop poster culture, punk, pop, or a generic Shopify template.

## Visual principles
- Real product/media first. Do not use cartoon, blob or abstract mock-product artwork when official imagery is available.
- Dark graphite/black atmosphere carries the flagship mood; paper/off-white is used as contrast for shopping clarity, never as the entire aesthetic.
- Mobile-first density: compact, touch-friendly, app-comfortable.
- One clear headline/action per region. Avoid double/triple title stacks, decorative eyebrows and long copy unless metadata is genuinely useful.
- Photography, motion and layout provide energy — not giant typography.

## Typography
- Display: Space Grotesk via `next/font`.
- UI/body: DM Sans via `next/font`.
- Sentence case for commerce copy; uppercase only for tiny metadata labels.
- Compact heading scale with tighter tracking; no condensed poster fonts.

## Color
- Night: `#09090A`
- Ink: `#111216`
- Graphite: `#18191D`
- Paper: `#F1F0EB`
- White: `#FCFCFA`
- Cobalt: `#5B6CFF` — digital/spatial accent
- Acid: `#D7FF57` — release/action accent
- Signal: `#FF4F36` — scarcity/limited accent

Use one bright accent at a time. Avoid bright-white pages from top to bottom.

## Geometry
- Core panel: soft asymmetric `24px 24px 9px 24px` family.
- Product/media card: compact `20px 20px 7px 20px` family.
- Compact control: `14px 14px 5px 14px` / `12px 12px 4px 12px`.
- The alternating soft-cut corner is a recurring TCC fingerprint.
- Rounded remains comfortable, but generic identical rounded cards are not the visual language.

## Product/media treatment
- Official TCC photography is used across hero, product cards, PDP galleries, collections, drops, cart/order surfaces and search previews.
- Product media is allowed to dominate; UI labels stay small and secondary.
- Use full-bleed crops, layered gradients and restrained technical metadata.
- Avoid fake product cartoons or obviously generated placeholders in presentation surfaces.

## Motion / spatial treatment
- CSS perspective and pointer-responsive tilt on selected hero/product objects.
- Gentle image scale/depth on hover.
- Short, app-like drawers, search overlays and filters.
- Reveal motion stays restrained and fast.
- Reduced-motion support remains mandatory.
- True GLB/3D can be added later when a suitable real cap model is supplied; do not fake a low-quality 3D object.

## PDP rules
- Product media first; real multi-image gallery.
- Purchase information is sticky on desktop and compact on mobile.
- Flow: identity → price/Payung → colour → size/guide → stock/quantity → Add to Cart / Buy Now → collapsed details/specification/delivery & pickup.
- Mobile Add to Bag remains locally sticky while the purchase panel is in view.
- Never bury variants below long descriptive copy.

## Mobile targets
360 / 375 / 390 / 412 / 430 are primary review widths.

## Loading / overlays
- Route, PDP and predictive-search loading should use skeleton shimmer rather than blank jumps or spinners.
- Internal scroll areas retain scrolling but hide native scrollbar chrome.
- Cart/search/filter overlays should use short motion and avoid GPU-heavy blur on mobile.

## Batch 8 refinement rules
- One meaningful title per section; avoid decorative eyebrow + title stacks unless the eyebrow conveys required state.
- Product discovery is image-led and border-light, not SaaS-card-led.
- Use TCC asymmetric soft-cut geometry sparingly; do not turn every control into a generic pill.
- Prefer custom compact popovers/sheets over browser-native dropdown chrome.
- Hide scrollbar chrome while preserving touch, wheel and keyboard scrolling.
- Loading states use quiet skeletons rather than spinners or layout jumps.
- PDP prioritises media, colour/size/availability and purchase actions; secondary copy stays collapsed by default.


## Batch 9 interface maturity rules
- Global header: opaque black/graphite only; no backdrop blur or translucent glass.
- Product cards use one contained shell with compact square media, integrated information footer and restrained hover lift.
- Desktop filters are floating anchored utility panels; mobile filters are bottom sheets. Never insert a large filter panel into document flow.
- Carousel/gallery arrows use dual-contrast treatment (dark core + light outline + shadow) so controls stay legible on any image.
- Shop mega menu uses editorial columns, quiet dividers and clear hierarchy rather than a generic SaaS dropdown card.
- Home category modules should balance Headwear with Apparel, Special and Collections using real brand photography.

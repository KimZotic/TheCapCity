# CURRENT STATE

## Phase
PHASE 3 — Commerce Studio full-review correction cycle

## Latest completed milestone
**Phase 3 Batch 9 — Storefront Full Review Polish.**

## Storefront status
Storefront full-review correction is active. Batch 9 applies the approved Payung artwork, reward PDP alignment, category-card spacing fixes and catalogue/filter cleanup while preserving the completed Commerce Studio baseline.

## Commerce Studio current capabilities
- Role-aware username/password demo authentication.
- Developer/Owner full authority, role baselines, per-module permission overrides, user activation and demo user creation.
- Sidebar-only desktop navigation; no redundant global workspace search/topbar.
- Professional Overview analytics with inspectable trend chart, status queues, recent orders and product ranking.
- Orders: stable scrollable queue, search/filter, full detail drawer, tracking, internal notes, fulfilment progression, cancellation/refund simulation.
- Products: Draft/Published/Archived lifecycle, delete tombstones, full gallery media, primary media, variant/colour media, variants, stock and pricing.
- Inventory: searchable fixed-frame variant list, thresholds, adjustments and ledger.
- Collections: stable list/editor frames plus searchable ordered product membership picker.
- Customers: profile/order/service context only; Payung mutation moved to Payung Program.
- Payung Program: member point operations, program rules, reward catalogue/variants/stock.
- Promotions/Gift Cards: discount rules, schedules, eligibility, usage, stored-value management.
- Drops & Events: searchable scalable product assignment, scheduling, publishing and storefront sync.
- Announcements: proper destination links and scheduling.
- Content Studio: hero/editorial controls, scalable Fresh on the Wall picker, homepage section visibility/order/schedule.
- Reports: period analytics, professional trend chart, CSV export, rankings, mix and customer/loyalty context.
- Support: inbox/conversation/context workspace connected to storefront live chat.
- Settings: staged Store/Fulfilment/Payments configuration and scalable delivery-zone management.


## Batch 8 polish now applied
- All nested Studio scroll areas keep scrolling but render without native scrollbar chrome.
- Inventory left/right workspace height is balanced and recent adjustments use the remaining vertical space.
- Customer order history is an on-demand drawer rather than permanent detail-page content; Payung mutations/activity remain owned by Payung Program.
- Promotions/gift cards normalize duplicate persisted IDs and use collision-resistant IDs for new records.
- Support context panels are compact rather than viewport-height.
- Settings Fulfilment uses responsive delivery-zone records with no wide-table dependency.
- Studio textareas share consistent internal padding and placeholder line rhythm.


## Batch 9 storefront polish now applied
- Payung Program hero and homepage teaser use the approved `Jangan Cakap Abang Tak Payung` artwork.
- Signed-in Payung summary is compact on desktop with no wasted left-panel height.
- Reward cards use one purposeful CTA; reward detail now follows the standard storefront PDP shell with global navigation.
- Reward checkout remains points-based and separate from MYR checkout to keep tender, discount, refund and loyalty accounting unambiguous.
- Homepage category cards no longer stretch to match taller siblings.
- Shop/category pages remove redundant description/quick-link clutter and use a refined filter popover.

## Shared demo state
- Catalogue / inventory / collections: `tcc-demo-catalog-v1`
- Customers: `tcc-demo-customers-v1`
- Account/member: `tcc-demo-account-v3`
- Payung rules/rewards: `tcc-demo-payung-v1`
- Orders/tracking/refunds: `tcc-demo-orders-v1`
- Studio announcement: `tcc-demo-studio-v1`
- Promotions/drops/content/settings/gift cards: `tcc-demo-operations-v1`
- Support conversation: `tcc-demo-support-v1`

## Review gate
Continue Studio review until approved, then perform the separate Storefront full review. Production backend/security/provider work remains deferred.

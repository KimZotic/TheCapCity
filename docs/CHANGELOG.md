## Phase 3 / Batch 9 — Storefront Full Review Polish
- Replaced Payung hero and homepage Payung teaser with the approved `Jangan Cakap Abang Tak Payung` artwork.
- Rebalanced signed-in Payung points/tier/recent-activity layout for desktop.
- Simplified Payung reward cards to one clear action instead of duplicated View/Choose-option controls.
- Rebuilt Payung reward detail to match normal PDP structure with global header/footer, variant selection, Add to Payung bag and Redeem now.
- Removed redundant reward-detail `View program` action.
- Prevented homepage category cards from stretching into empty whitespace.
- Simplified Shop/category headers by removing low-value description/quick-link clutter.
- Refined product filter popover hierarchy, grouping and actions.

# CHANGELOG

## Phase 2 / Batch 11 — Final Storefront Completion + QA Hardening
- Added functional footer newsletter demo persistence under `tcc-demo-newsletter-v1`; removed the last decorative-only newsletter control.
- Added branded `not-found` and global error-recovery surfaces.
- Added robots + sitemap routes as the demo SEO foundation.
- Hardened mobile filter behavior with Escape handling and clean temporary body-scroll locking.
- Added fullscreen PDP viewer backdrop-to-close behavior.
- Added variant-level `priceOverride` support and wired cart pricing to the selected variant.
- Added Gift Card denomination pricing (RM100 / RM200 / RM300) without duplicating product records.
- Added real-media demo products for Cap Accessories and Gift Card.
- Corrected Special category mapping so Cap Accessories, Bags, Gift Card and Others no longer bleed into one another or return empty by design.
- Updated product-card price copy for Gift Card to `From RM…`.
- Updated PDP option labels so Gift Card uses `Amount` and Cap Accessories uses `Specification`.
- Suppressed meaningless size controls for ONE-size accessory and Digital gift-card variants.
- Corrected PDP Payung estimate to the current demo rule of 3 points per RM1.
- Added account password-recovery demo flow.
- Added persistent saved delivery address to the demo account and checkout prefill for signed-in users.
- Added Account shortcuts to Support and Tracking.
- Made form-submit button intent explicit across search, tracking, checkout, cart promo, account, support and newsletter flows.
- Re-ran source-level syntax/import/basic dead-control audits.

## Phase 2 / Batch 12 — Final Review Refinement
- Rebuilt homepage hero and flagship rhythm.
- Fixed product-card readability and grid density.
- Refined cap/apparel sizing behavior and PDP colour density.
- Upgraded Live Chat and Powered by SteadyGroup treatments.
- Rebuilt Payung Program with physical reward redemption + tracking orders.
- Polished Account visual hierarchy and address country support.
- Reworked checkout phone, country, destination shipping, discount and gift-card flows.
- Removed Standard/Express shipping split and cart delivery estimates.

## Phase 2 / Batch 13 — Final Storefront Polish
- Equal-height product cards and aligned commerce metadata.
- Admin-ready announcement configuration boundary.
- Payung Program mobile tier cards + tier icons.
- Payung hero/reward visual refinement.
- Dedicated Payung reward catalogue and points-mode Bag/Checkout/Tracking flow.
- Mixed-currency cart protection.
- Account dark-form contrast fixes.
- Checkout country code, summary codes, payment icons and subtitle cleanup.

## Phase 3 / Batch 1 — TCC Commerce Studio Foundation
- Added `/studio` branded management workspace.
- Added responsive desktop rail + mobile admin navigation for all planned modules.
- Added Overview with seeded performance metrics, catalogue-health counts and browser-local live orders.
- Added functional Orders workspace reading the storefront order repository and advancing fulfilment state.
- Added functional Announcements editor with browser persistence.
- Wired storefront AnnouncementBar to Studio settings for first Admin ↔ Storefront behavior.
- Added Products read-only catalogue foundation and explicit foundation routes for remaining Phase 3 modules.
- Added Studio workspace search/quick destinations.
- Suppressed storefront Cart Drawer and Live Chat while inside Commerce Studio.
- Added `/studio` robots exclusion.
- Added Studio storage/contracts/provider architecture under `src/lib/studio` and `src/components/studio`.

## Phase 3 — Batch 2
- Commerce Studio dashboard visual/UX maturity rebuild.
- Added demo username/password authentication and role-based module permissions.
- Added Developer/Owner Team & Access controls with per-user permission overrides.
- Rebuilt Payung Program hero/member summary and reward presentation.
- Added dedicated Payung reward product-detail flow with reward-specific variants and stock.
- Added real social icons in Payung earning methods.
- Added draggable/persistent Live Chat launcher and mobile footer badge hardening.
- Refined storefront filter/sort control styling.
- Added CSS module declaration for editor diagnostics.
- Canonical continuity docs are `/docs`; old root duplicates are obsolete.

## Phase 3 — Batch 3
- Added browser-local shared catalogue repository `tcc-demo-catalog-v1` with product, collection and inventory-adjustment state.
- Added root `CatalogProvider` so Storefront and Commerce Studio share one live catalogue snapshot.
- Added functional Products workspace: create drafts, publish/hide, edit product identity/price/state/media/category/style and manage variants.
- Added functional Inventory workspace: low/out-of-stock filters, per-variant adjustments, reason/note capture and persistent ledger.
- Added functional Collections workspace: create/edit/publish, hero media, featured state, membership and product ordering.
- Wired live catalogue state into Shop/category grids, product cards, PDP, Collections and predictive search.
- New Studio-created products/collections can resolve on dynamic storefront routes without changing source code.
- Cart money lines now reconcile live catalogue price, stock and media updates.
- Overview catalogue-health metrics/top products now read mutable catalogue state.
- Added custom light Studio select control; no native `<select>` remains in source.

## Phase 3 — Batch 4
- Removed the redundant desktop Commerce Studio topbar; retained a compact mobile-only navigation bar.
- Removed sidebar View Storefront and connected-workspace filler; rebuilt signed-in user presentation with avatar/profile treatment and bottom logout.
- Moved workspace search into the sidebar and preserved Cmd/Ctrl+K command navigation.
- Replaced centered loading text with full workspace/table skeleton states.
- Rebuilt Overview into compact operational analytics with interactive chart points/range controls, order-status drill-down, live recent orders and product ranking derived from order data when available.
- Rebuilt Orders with search, status queues, fulfilment filters and a full order-detail drawer containing customer/contact, delivery/pickup, line items, payment/totals, timeline, internal note and status progression.
- Rebuilt Products workflow with Details/Variants/Media tabs, active/draft/archive list views, archive/restore and permanent deletion.
- Added product deletion tombstones and archive state to the shared catalogue repository so seeded records do not silently return after deletion.
- Added collection active/draft/archive workflow, archive/restore and permanent deletion with collection tombstones.
- Archived/deleted products and collections are excluded from storefront discovery, PDP/collection resolution and predictive search.
- Tightened Inventory, Collections, Announcements and Team & Access page hierarchy by removing redundant title stacks and explanatory filler.
- Rebuilt Commerce Studio login into a centered TCC-branded secure workspace card without the previous split-panel template composition.

## Phase 3 — Batch 5
- Added shared customer directory `tcc-demo-customers-v1`, merging demo members, current account state and order-derived customers.
- Added Customers workspace with search, tier filters, order context, Payung activity, points adjustments, lifetime-spend/tier basis and internal notes.
- Added account-state synchronization so Studio Payung/customer adjustments reflect on the signed-in storefront member.
- Added shared Payung Program repository `tcc-demo-payung-v1` for points rules and reward catalogue state.
- Added Payung Program management workspace with Overview, Members, Rewards and Program controls.
- Added reward Active/Draft/Archived lifecycle, create/duplicate/delete, points price, media, category, variants and reward stock editing.
- Wired active reward catalogue into storefront Payung Program and reward PDP routes.
- Wired editable points-per-RM and join bonus into storefront earning/account behavior.
- Payung cart lines now reconcile live reward points, stock, media and active state.

## Phase 3 — Admin Completion Pass
- Added shared `tcc-demo-operations-v1` repository for Promotions, gift cards, Drops & Events, homepage content and operational Settings.
- Added functional Promotions workspace with percentage/fixed codes, minimum spend, product/collection eligibility, usage limits, schedules and usage tracking.
- Added admin-managed stored-value gift cards and wired checkout to validate/decrement live balances.
- Added Drops & Events workspace and live storefront Drops index/detail consumption.
- Added scheduled announcement visibility.
- Added Content Studio controls for hero slides, Fresh on the Wall, homepage section order/visibility/schedule, editorial tiles and editorial feature content.
- Added Reports workspace with live period-based commercial, catalogue, customer, loyalty, fulfilment, payment, collection and drop reporting.
- Added full-order refund simulation and report adjustment.
- Added Studio Support workspace connected to the customer live-chat thread.
- Added Settings for support email, order prefix, pickup, shipping zones/rates and checkout payment-method availability.
- Wired storefront checkout to configurable shipping/pickup/payment/order-prefix settings.
- Replaced remaining seeded drop/search/home merchandising paths with live Studio-backed state where applicable.
- Completed Studio module routing; no unfinished placeholder module remains.
- Completed final source-level syntax/import/native-control/TODO audits for review handoff.

## Phase 3 — Batch 7 Studio Full Review Hardening
- Removed permanent workspace search/command search from Studio sidebar and mobile chrome.
- Rebuilt Overview revenue visualization with a professional inspectable trend chart, axis labels and hover/click values.
- Standardized operator list/editor surfaces to fixed workspace-height frames with internal scrolling so short lists do not collapse the visual structure and long lists remain manageable.
- Expanded Products media management to full catalogue galleries with primary-image control, ordering and variant/colour media mapping.
- Replaced long collection/drop/promotion product grids with searchable, scrollable product pickers and selection views.
- Removed Payung points/spend mutation from Customers; Customers is now a service/profile/order context surface while member point operations remain in Payung Program.
- Hid browser-native number steppers in Studio and removed number input types from reviewed Payung/promotion flows where not required.
- Fixed Promotions list key stability and rebuilt promotion eligibility management for large catalogues.
- Normalized Announcement destination values into proper absolute links.
- Rebuilt Reports into compact operational analytics with interactive revenue performance, CSV export, rankings, commerce mix and customer/loyalty context.
- Rebuilt Support into an inbox/conversation/context workspace.
- Rebuilt Settings into Store/Fulfilment/Payments tabs with staged Save Changes behavior and scalable delivery-zone management.
- Rebuilt Team & Access with role baselines, per-module permission overrides, active/disabled states and Add User demo management.
- Fixed Content Studio product-selection keying and moved Fresh on the Wall selection to the scalable product picker.

## Phase 3 — Batch 8 Studio Detail Polish
- Hid native scrollbar chrome across every Commerce Studio internal scroller while preserving mouse-wheel, touch and keyboard scrolling.
- Rebalanced Inventory into matched-height operational columns; Recent Adjustments now fills remaining workspace height without creating dead space.
- Simplified Customers detail: order history moved into an on-demand right drawer opened from the Orders metric; inline Payung activity/order blocks removed.
- Normalized Studio textarea padding/placeholder rhythm for cleaner notes and content editing.
- Added operations-state ID normalization plus collision-resistant promotion/gift-card IDs to eliminate duplicate React-key warnings from existing persisted demo data.
- Compacted Support context so Recent Customer Orders no longer stretches to full workspace height.
- Rebuilt Settings Fulfilment layout from a wide table into responsive zone records; removed horizontal-scroll dependence and tightened Store/Payments presentation.

# DECISIONS

## Locked storefront decisions
- Phase 2 Batch 13 visual/UX baseline remains locked during Admin construction.
- Account is required for Payung Program; guest checkout remains available.
- Delivery and Store Pickup are fulfilment modes.
- Payung rewards are a separate points-priced catalogue and cannot mix with MYR products in one transaction.

## Commerce Studio decisions
- Product name: **TCC Commerce Studio**.
- Admin is a branded operational product, not a generic SaaS template.
- `/docs` is the canonical continuity-document source; old root documentation copies are obsolete.
- Developer and Owner are highest-access roles; other users use role defaults plus optional per-user module overrides.
- Demo auth is username/password browser-local validation only; production auth is server-authoritative later.

## Batch 3 catalogue decisions
- Mutable demo catalogue state lives under `tcc-demo-catalog-v1` rather than rewriting seeded source arrays.
- Seeded demo records remain the fallback/source baseline; Studio writes are overlays/snapshots so production adapters can replace the demo repository later.
- Product slugs are stable route identifiers. New Studio products may create new slugs; existing products should not casually change slugs after publication.
- Publishing is explicit. Hidden products/collections are removed from normal storefront discovery but their records remain in Studio.
- Variant inventory is the source for product `totalStock`; zero total stock automatically sets Sold Out, and replenishing a Sold Out product moves it to Restock.
- Inventory adjustments require a reason and create a persistent demo ledger.
- Collection membership uses ordered product slugs so merchandising order can be controlled without code edits.
- Studio controls use custom dropdown UI rather than browser-native selects to preserve the mature visual standard.

## Batch 4 Studio UX decisions
- Desktop Commerce Studio uses the sidebar as the primary orientation/navigation surface; a persistent desktop topbar is unnecessary.
- Page-level kicker + title + subtitle stacks are not the default admin pattern. Operational controls and data should identify the context.
- Workspace search remains available from the sidebar and Cmd/Ctrl+K rather than consuming permanent horizontal page chrome.
- Orders must support search/filter/detail inspection before operational state changes; list-only action rows are insufficient.
- Studio loading uses structural skeletons rather than centered loading text/spinners.
- Products and collections support Draft/Published/Archived lifecycles and explicit deletion. Deletion uses tombstones in the demo repository so default seed merging cannot resurrect deleted records.
- Admin analytics should be inspectable/interactive rather than decorative static chart shapes.

## Batch 5 Customers + Payung decisions
- Customer operations and Payung Program use shared browser-local repositories rather than Studio-only mock arrays.
- Payung reward inventory remains separate from normal retail inventory.
- Member tier is derived from lifetime spend; Studio may adjust lifetime-spend basis for demo/admin validation.
- Points adjustments require an operational reason and synchronize to the active storefront account when identities match.
- Only Active Payung rewards appear on the storefront. Draft/Archived rewards remain manageable in Studio.
- Points-per-RM and join bonus are admin-configurable demo rules and are consumed by storefront account earning logic.

## Admin completion decisions
- Promotions, gift cards, releases, homepage merchandising and fulfilment/payment configuration share `tcc-demo-operations-v1` so Studio changes propagate without source edits.
- Discount usage is counted after successful money checkout; gift-card balance is decremented by the amount actually applied.
- At least one checkout payment method must remain enabled.
- Shipping zones are configurable operational data; demo rates are not treated as final production commercial rules.
- Homepage sections can be reordered, hidden and scheduled from Content Studio.
- Reports read shared demo repositories rather than independent fake report arrays wherever transaction/catalogue data exists.
- Refund simulation affects net revenue reporting but remains demo-only until a real payment provider exists.
- Phase 3 is considered functionally complete for client review; production backend/security/provider work remains deferred.

## Batch 7 Studio full-review decisions
- Commerce Studio has no persistent global search control; module-level search exists only where it directly helps operations.
- List-heavy Studio surfaces keep a stable workspace frame and scroll internally rather than changing card height based on row count.
- Catalogue media is a gallery-first model with explicit primary media and optional variant/colour-specific media.
- Customer records are read/service context. Payung financial/points mutations belong only to Payung Program management.
- Large catalogue relationships use searchable pickers with selected-only views instead of unbounded checkbox/card grids.
- Reporting must be inspectable and exportable; decorative charts are not sufficient.
- Settings changes are staged locally and explicitly saved rather than every keystroke being treated as a published operational change.
- Team access uses role baselines plus per-module overrides; Developer/Owner remain locked full-access roles.

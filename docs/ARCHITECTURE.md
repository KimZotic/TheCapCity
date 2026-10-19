# ARCHITECTURE

```text
Storefront UI                    TCC Commerce Studio
      ↓                                 ↓
Commerce / Account Services      Studio workspaces
      ↓                                 ↓
Shared demo repositories / browser-local adapters
      ↓
Production backend adapters after client approval
```

## Shared demo repositories

### Catalogue / inventory / collections
`src/lib/studio/catalog-storage.ts`
- key: `tcc-demo-catalog-v1`
- mutable product records, variants, publish/archive/delete state, stock thresholds, inventory ledger and collections.
- Storefront Shop, PDP, cart reconciliation, collections and search consume the same state.

### Customers
`src/lib/account/customer-storage.ts`
- key: `tcc-demo-customers-v1`
- customer identities, notes, member context and Studio adjustments.

### Payung Program
`src/lib/account/payung-storage.ts`
- key: `tcc-demo-payung-v1`
- points rules, member/reward catalogue state, variants and reward inventory.

### Orders / tracking / refunds
`src/lib/services/demo-order-service.ts`
- key: `tcc-demo-orders-v1`
- Delivery/Pickup order lifecycle, tracking, configurable reference prefix and refund simulation.

### Studio announcement
`src/lib/studio/studio-storage.ts`
- key: `tcc-demo-studio-v1`
- announcement content, link and schedule.

### Commerce operations
`src/lib/studio/operations-storage.ts`
- key: `tcc-demo-operations-v1`
- promotions and usage counters
- gift-card codes/balances
- drops/releases
- homepage merchandising/content/scheduling
- pickup configuration
- shipping zones/rates
- enabled checkout payment methods
- support email/order prefix

### Support
- customer thread key: `tcc-demo-support-v1`
- Studio open/resolved state: `tcc-demo-support-studio-v1`
- agent replies and storefront chat share one browser-local conversation state.

## Access model
Studio demo auth validates role/permission UX in-browser. Developer and Owner have highest authority. Admin/Finance/Merchandising/Fulfillment/Support receive role defaults plus optional per-user module overrides.

Production must replace browser-local auth with server authentication, password hashing, secure sessions, authorization, audit trails and protected APIs.

## Production boundary
Browser storage is demo-only and not authoritative production data. After approval, repository/provider interfaces migrate to database-backed services with transactional inventory, concurrency control, durable media, real payment/shipping integrations and operational observability.

## Phase 3 Batch 7 Studio interaction architecture
- List/editor workspaces use stable viewport-height containers with internal scrolling on desktop; mobile falls back to natural document flow.
- Large product relationships use a reusable searchable `StudioProductPicker` rather than unbounded grids.
- Product media consists of ordered gallery media, one explicit primary image and optional colour/variant media mapping.
- Customer service context is separate from Payung member mutation; point adjustments remain within the Payung management boundary.
- Settings use draft-then-save semantics before writing shared operations state.
- Reports derive from shared order/catalogue/customer repositories and expose exportable transaction data.

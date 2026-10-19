# TCC MEDIA INTAKE

The storefront is now ready to accept original The Cap City photography without changing the page architecture.

## Preferred sources
1. Original campaign exports from The Cap City.
2. Original product photography used on the current website.
3. Original/high-resolution social campaign files from the official Instagram source.

Do not use screenshots from Instagram as final production assets.

## Preferred delivery structure
```text
media/
  campaign/
  products/
  collections/
  editorial/
  flagship/
```

## Product images
Recommended source quality: at least 1600px on the long edge where available.
Preferred composition: clean product isolation or intentionally art-directed product frame.
Useful ratios: 4:5 primary, 1:1 optional, landscape detail optional.

## Campaign/editorial images
Recommended source quality: 2000px+ on the long edge where available.
Keep uncropped originals when possible so the storefront can create desktop and mobile crops independently.

## Naming
Use stable descriptive names, for example:
```text
products/kl-legacy-classic-black-01.webp
campaign/kl-legacy-city-2026-hero-01.webp
collections/september-drop-editorial-01.webp
```

## Current code path
`ProductSummary.image` is optional. When populated, `ProductArtwork` displays the real image; when absent it displays the branded TCC fallback artwork.

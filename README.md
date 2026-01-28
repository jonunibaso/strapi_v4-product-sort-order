# strapi_v4-product-sort-order
Strapi v4 admin plugin to drag & drop reorder **Product** entries and persist the order into a numeric field (`sortOrder`).

## What it does

- Adds a dedicated Admin page to reorder entries via **drag & drop**
- Persists the new order by updating an integer field on each entry (`sortOrder`)
- Your frontend can simply query and sort by `sortOrder ASC`

## Compatibility

- ✅ Strapi **v4** (tested on 4.24.x)
- ❌ Not compatible with Strapi v5 (plugin architecture differs)

## Default configuration (Product)

By default this plugin targets:

- Content-type UID: `api::product.product`

And expects these fields on the Product content-type:

- `sortOrder` (**integer**) — stores the manual order
- `Title` (**string**) — displayed in the list (**case-sensitive**)
- `Slug` (**uid** or **string**) — displayed in the list (**case-sensitive**)

> ⚠️ Strapi attribute names are **case-sensitive**.  
> If your model uses `title` / `slug` (lowercase), update the plugin code accordingly.

## Install

1. Copy the plugin folder into your Strapi project:

   `src/plugins/product-sort-order`

2. Build the admin:

   ```bash
   yarn build
3. Start / restart Strapi.


## Usage

Open Strapi Admin

Click “Orden productos” (Product order)

Drag & drop rows to reorder

Click Save

Frontend sorting example

REST:

GET /api/products?sort=sortOrder:asc

GraphQL / internal queries:

orderBy: { sortOrder: 'asc' }

Adapting to other content-types

To reuse the plugin for another collection type, change:

Content-type UID (e.g. api::episode.episode)

Order field (currently sortOrder)

Display fields (currently Title and Slug)

Example changes:

api::product.product → api::episode.episode

Title → title

Slug → slug


## Screenshots

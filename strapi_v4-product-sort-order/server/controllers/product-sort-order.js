"use strict";

module.exports = {
  async list(ctx) {
    const products = await strapi.entityService.findMany("api::product.product", {
      fields: ["id", "Title", "Slug", "sortOrder", "publishedAt"],
      sort: [{ sortOrder: "asc" }, { id: "asc" }],
      publicationState: "preview", // incluye borradores si tu CT tiene draft/publish
      pagination: { page: 1, pageSize: 1000 },
    });

    ctx.body = { data: products };
  },

  async save(ctx) {
    const { items } = ctx.request.body || {};
    if (!Array.isArray(items)) {
      return ctx.badRequest("Body inválido. Esperado { items: [{ id, sortOrder }] }");
    }

    // Actualiza uno a uno (simple y suficiente para 30 productos)
    await Promise.all(
      items.map((it, index) =>
        strapi.entityService.update("api::product.product", it.id, {
          data: { sortOrder: typeof it.sortOrder === "number" ? it.sortOrder : index + 1 },
        })
      )
    );

    ctx.body = { ok: true };
  },
};

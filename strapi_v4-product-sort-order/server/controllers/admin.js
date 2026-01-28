"use strict";

module.exports = {
  async listProducts(ctx) {
    const products = await strapi.entityService.findMany("api::product.product", {
      fields: ["Title", "Slug", "sortOrder"],
      sort: ["sortOrder:asc", "Title:asc"],
      pagination: { page: 1, pageSize: 500 },
      populate: {
        // si tu campo de imagen se llama distinto, cámbialo aquí
        FeatureImage: { fields: ["url"] },
      },
    });

    ctx.body = { data: products };
  },

  async reorderProducts(ctx) {
    const { ids } = ctx.request.body || {};

    if (!Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest("ids must be a non-empty array");
    }

    // Guardamos sortOrder 1..N (o 0..N-1 si prefieres)
    await Promise.all(
      ids.map((id, index) =>
        strapi.entityService.update("api::product.product", id, {
          data: { sortOrder: index + 1 },
        })
      )
    );

    ctx.body = { ok: true, count: ids.length };
  },
};

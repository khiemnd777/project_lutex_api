"use strict";

const {
  seoCollection,
  toSanitizedModels,
} = require("../../../_stdio/shared/utils");
const { search } = require("../services/post-items");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async seo(ctx) {
    return await seoCollection("post-items", { Slug: ctx.params.slug }, []);
  },
  async search(ctx) {
    const query = ctx.query;
    if (query) {
      console.log(query);
      const result = await strapi.services["post-items"].search(
        query.query,
        query.limit,
        query.start
      );
      return toSanitizedModels(result, strapi.models["post-items"]);
    }
  },
};

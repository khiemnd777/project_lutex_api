"use strict";

const { seoCollection } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async seo(ctx) {
    return await seoCollection("post-items", { Slug: ctx.params.slug }, [
      "Catalog",
      "Router",
      "Related_Items",
    ]);
  },
};

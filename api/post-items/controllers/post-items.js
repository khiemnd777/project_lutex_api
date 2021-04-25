"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async seo(ctx) {
    const entities = await strapi.services["post-items"].find({Slug: ctx.params.slug});
    return entities ? entities[0] && entities[0].Seo : null;
  },
};

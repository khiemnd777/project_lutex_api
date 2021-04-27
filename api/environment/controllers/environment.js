"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async datenow(ctx) {
    return new Date();
  },
  async theme(ctx) {
    const data = await strapi.services.environment.find(ctx.query);
    return data.Theme.Theme;
  },
};

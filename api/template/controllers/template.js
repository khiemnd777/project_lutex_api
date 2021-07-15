'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findTemplateById(ctx) {
    return await strapi.services["template"].findTemplateById(ctx.params.id);
  },
};

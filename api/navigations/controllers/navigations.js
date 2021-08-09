"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByName(ctx) {
    const entities = await strapi.query('navigations')
      .model
      .find({Name: ctx.params.name})
      .select('Children');
    const models = entities;
    return models[0];
  },
};

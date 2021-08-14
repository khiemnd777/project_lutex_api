"use strict";

const { seoSingle } = require('../../../_stdio/shared/utils');
const { seo } = require('../../post-items/controllers/post-items');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async seo(ctx){
    return await seoSingle('environment');
  },
  async datenow(ctx) {
    return new Date();
  },
  async theme(ctx) {
    const data = await strapi.services.environment.find(ctx.query);
    return data.Theme.Theme;
  },
  async pairPrivateToken(ctx) {
    strapi.log.debug(JSON.stringify(ctx.params));
    const ptk = ctx.params.ptk;
    const paired = await strapi.services.environment.pairPrivateToken(ptk);
    return paired;
  },
};

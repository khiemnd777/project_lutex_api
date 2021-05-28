"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async isPrivate() {
    const entity = await strapi.query('environment').findOne();
    return !!entity && entity.Private;
  },
  async pairPrivateToken(privateToken) {
    const entity = await strapi.query('environment').findOne();
    if(!entity) return true;
    if(!entity.Private) return true;
    if(!privateToken) return false;
    if(!entity.PrivateToken) return false;
    return entity.PrivateToken === privateToken;
  }
};

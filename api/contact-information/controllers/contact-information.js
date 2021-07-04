'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByKey (ctx){
    const { params } = ctx;
    const service = strapi.services["contact-information"];
    const foundEntity = await service.getContactInformationByKey(params.key);
    return foundEntity;
  }
};

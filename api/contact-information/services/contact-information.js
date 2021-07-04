'use strict';

const { arraySize } = require('../../../_stdio/shared/utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getContactInformationByKey(key) {
    const ci = await strapi.query("contact-information").findOne();
    if(ci) {
      if(arraySize(ci.Parameters)) {
        const foundCi = ci.Parameters.find(p => p.Key === key);
        return foundCi;
      }
    }
    return null;
  }
};

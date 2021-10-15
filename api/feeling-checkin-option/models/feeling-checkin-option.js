"use strict";

const { slugifyUtils } = require('../../../_stdio/shared/utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      slugifyUtils(data, "Name", "Field");
    },
    async beforeUpdate(params, data) {
      slugifyUtils(data, "Name", "Field");
    },
  },
};

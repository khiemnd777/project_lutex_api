"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { slugifyUtils } = require("../../../_stdio/shared/utils");

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      slugifyUtils(data, 'Name', 'Slug');
    },
    async beforeUpdate(params, data) {
      slugifyUtils(data, 'Name', 'Slug');
    },
  },
};

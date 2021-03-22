"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { slugifyUtils, displayNameUtils } = require("../../../_stdio/shared/utils");

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      displayNameUtils(data, 'Name');
      slugifyUtils(data, 'DisplayName');
    },
    async beforeUpdate(params, data) {
      displayNameUtils(data, 'Name');
      slugifyUtils(data, 'DisplayName');
    },
  },
};

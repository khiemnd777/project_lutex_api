"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { displayNameUtils } = require("../../../_stdio/shared/utils");

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      displayNameUtils(data, "Name");
    },
    async beforeUpdate(params, data) {
      displayNameUtils(data, "Name");
    },
  },
};

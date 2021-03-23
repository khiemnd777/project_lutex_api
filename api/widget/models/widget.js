"use strict";

const { displayNameUtils } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      displayNameUtils(data, "Name", "FriendlyName");
    },
    async beforeUpdate(params, data) {
      displayNameUtils(data, "Name", "FriendlyName");
    },
  },
};

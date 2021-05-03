"use strict";

const {
  displayNameUtils,
  slugifyUtils,
} = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      displayNameUtils(data, "Name");
      slugifyUtils(data, "DisplayName", "Name");
      data.InputFields && data.InputFields.forEach((inputField) => {
        displayNameUtils(inputField, "Name", "Title");
        slugifyUtils(inputField, "Title", "Name");
      });
    },
    async beforeUpdate(params, data) {
      displayNameUtils(data, "Name");
      slugifyUtils(data, "DisplayName", "Name");
      strapi.log.debug(JSON.stringify(data));
      data.InputFields && data.InputFields.forEach((inputField) => {
        displayNameUtils(inputField, "Name", "Title");
        slugifyUtils(inputField, "Title", "Name");
      });
    },
  },
};

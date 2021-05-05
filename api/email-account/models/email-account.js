"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      // If email account was set as default, all of the others must be default to be false.
      if (data.IsDefault) {
        await strapi.services["email-account"].setAllDefaultsToBe(false);
      }
    },
    async beforeUpdate(params, data) {
      // If email account was set as default, all of the others must be default to be false.
      if (data.IsDefault) {
        await strapi.services["email-account"].setAllDefaultsToBe(false);
      }
    },
  },
};

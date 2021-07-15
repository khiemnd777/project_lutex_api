"use strict";

const {
  syncWidgetWithEmptyFields,
} = require("../../../_stdio/services/widget/widget-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await syncWidgetWithEmptyFields(data.Widgets);
    },
    async beforeUpdate(params, data) {
      await syncWidgetWithEmptyFields(data.Widgets);
      await strapi.middleware.cache.bust({ model: "router", id: data.id });
    },
  },
};

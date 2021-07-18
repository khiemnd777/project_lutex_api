"use strict";

const {
  syncWidgetWithEmptyFields,
} = require("../../../_stdio/services/widget/widget-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const prepareProp = (data, propName) => {
  const propVal = (data && data[propName]) || "";
  return propVal;
};

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const friendlyName = prepareProp(data, "FriendlyName");
      if (!friendlyName.trim()) {
        data.FriendlyName = data.Name;
      }
      await syncWidgetWithEmptyFields(data.Widgets);
    },
    async beforeUpdate(params, data) {
      const friendlyName = prepareProp(data, "FriendlyName");
      if (!friendlyName.trim()) {
        data.FriendlyName = data.Name;
      }
      await syncWidgetWithEmptyFields(data.Widgets);
      strapi.middleware.cache &&
        strapi.middleware.cache.bust &&
        (await strapi.middleware.cache.bust({
          model: "template",
          id: data.id,
        }));
    },
  },
};

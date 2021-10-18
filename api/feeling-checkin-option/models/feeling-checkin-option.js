"use strict";

const { slugifyUtils } = require("../../../_stdio/shared/utils");
const { convert } = require("html-to-text");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      slugifyUtils(data, "Name", "Field");
      if (data.Type === "checkbox") {
        (!data.Value || data.UpdateValue) && (data.Value = convert(data.Answer));
      }
      data.UpdateValue = false;
    },
    async beforeUpdate(params, data) {
      slugifyUtils(data, "Name", "Field");
      if (data.Type === "checkbox") {
        (!data.Value || data.UpdateValue) && (data.Value = convert(data.Answer));
      }
      data.UpdateValue = false;
    },
  },
};

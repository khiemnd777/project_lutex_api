"use strict";

const {
  slugifyUtils,
  buildRouterPath,
} = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      slugifyUtils(data, "Title");

      // PreviewUrl
      if (data.Router) {
        const router = await strapi
          .query("router")
          .model.findById(data.Router)
          .select("-Parameters -Widgets");
        if (router) {
          const path = buildRouterPath(router.Path, data);
          data.PreviewUrl = `${path}?state=preview`;
        }
      }
    },
    
    async beforeUpdate(params, data) {
      slugifyUtils(data, "Title");

      // PreviewUrl
      if (data.Router) {
        const router = await strapi
          .query("router")
          .model.findById(data.Router)
          .select("-Parameters -Widgets");
        if (router) {
          const path = buildRouterPath(router.Path, data);
          data.PreviewUrl = `${path}?state=preview`;
        }
      }
    },
  },
};

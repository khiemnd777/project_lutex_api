"use strict";

const {
  toSanitizedModels,
  toSanitizedModel,
} = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findAll(ctx) {
    const service = strapi.services["router"];
    return await service.findAll();
  },
};

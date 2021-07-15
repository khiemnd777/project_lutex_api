"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async findAll(ctx) {
    const entities = await strapi
      .query("router")
      .model.find({})
      .select("-Widgets -Parameters");
    const models = entities?.map((item) => {
      const ref = item.toObject();
      return {
        Path: ref.Path,
        IsAuth: ref.IsAuth,
        Name: ref.Name,
        templateId: ref.template,
        id: ref.id
      };
    });
    return models;
  },
};

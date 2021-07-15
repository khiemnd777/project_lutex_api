"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async findTemplateById(templateId) {
    const entity = await strapi
      .query("template")
      .model.findById(templateId)
      .select("-Widgets -Parameters");
    const ref = entity.toObject();
    return {
      id: ref.id,
      Name: ref.Name,
      FriendlyName: ref.FriendlyName,
      StyleName: ref.StyleName,
    };
  },
};

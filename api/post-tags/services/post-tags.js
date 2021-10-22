"use strict";

const { toSanitizedModels } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getAllTags() {
    const result = await strapi
      .query("post-tags")
      .model.find()
      .select("Tag Posts Router");

    var models = toSanitizedModels(result, strapi.models["post-tags"]);

    var modelsParsed = await Promise.all(
      models.map((tag) => {
        return new Promise(async (resolve) => {
          const router =
            (tag.Router &&
              (await strapi
                .query("router")
                .model.findById(tag.Router)
                .select("-Parameters -Widgets"))) ||
            [];
          return resolve({
            Tag: tag.Tag,
            Posts: tag.Posts,
            Router: {
              id: router?.id,
              Path: router?.Path,
            },
          });
        });
      })
    );

    return modelsParsed;
  },
};

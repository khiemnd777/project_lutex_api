const { isArray, toSanitizedModel, toSanitizedModels } = require("../../shared/utils");

module.exports = {
  Website: {
    async Name() {
      return await strapi.query("environment").find().Name;
    },
  },
  Post: {
    async FirstPost() {
      const postItems = await strapi
        .query("post-items")
        .find({ _sort: "createdAt:desc", _start: 0, _limit: 1 });
      return !!postItems && isArray(postItems)
        ? toSanitizedModel(postItems[0], strapi.models["post-items"])
        : null;
    },
    async NewestPosts(start, limit) {
      const postItems = await strapi.query("post-items").find({ _sort: "createdAt:desc", _start: start, _limit: limit });
      return !!postItems && isArray(postItems)
        ? toSanitizedModels(postItems, strapi.models["post-items"])
        : [];
    }
  },
};

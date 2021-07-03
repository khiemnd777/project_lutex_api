const { isArray } = require("../../../utils");

const syncFeaturedPostWithEmptyFields = async (featuredPosts) => {
  if (isArray(featuredPosts)) {
    await Promise.all(
      featuredPosts.map(async (fp) => {
        if (!fp.Title || !fp.Router) {
          if (fp.Post) {
            const postItem = await strapi
              .query("post-items")
              .findOne({ id: fp.Post });
            if (postItem) {
              if (!fp.Title) {
                if (postItem.Title) {
                  fp.Title = postItem.Title;
                }
              }
              if (!fp.Router) {
                console.log(postItem);
                if (postItem.Router) {
                  fp.Router = postItem.Router.id;
                }
              }
            }
          }
        }
      })
    );
  }
};

module.exports = {
  syncFeaturedPostWithEmptyFields,
};

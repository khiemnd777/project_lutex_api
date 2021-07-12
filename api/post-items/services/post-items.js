"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async search(query, limit, start) {
    console.log(`query ${query}, limit ${limit}, start ${start}`);
    const result = await strapi
      .query("post-items")
      .search({ _q: query, _limit: limit, _start: start });
      return result;
  },
};

'use strict';

const { getAllTags } = require('../services/post-tags');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getAllTags(ctx){
    const service = strapi.services['post-tags'];
    return await service.getAllTags();
  }
};

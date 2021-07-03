'use strict';

const { syncFeaturedPostWithEmptyFields } = require('../../../_stdio/shared/components/post/feature-post/utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data){
      await syncFeaturedPostWithEmptyFields(data.FeaturedPosts);
    },
    async beforeUpdate(params, data){
      await syncFeaturedPostWithEmptyFields(data.FeaturedPosts);
    }
  }
};

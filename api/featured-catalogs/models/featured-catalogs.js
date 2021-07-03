'use strict';

const { syncFeaturedCatalogWithEmptyFields } = require('../../../_stdio/shared/components/post/feature-catalog/utils');
const { isArray } = require('../../../_stdio/shared/utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles:{
    async beforeCreate(data){
      await syncFeaturedCatalogWithEmptyFields(data.FeaturedCatalogs);
    },
    async beforeUpdate(params, data){
      await syncFeaturedCatalogWithEmptyFields(data.FeaturedCatalogs);
    }
  }
};

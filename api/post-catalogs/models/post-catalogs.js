'use strict';

const { syncFeaturedCatalogWithEmptyFields } = require('../../../_stdio/shared/components/post/feature-catalog/utils');
const { syncFeaturedPostWithEmptyFields } = require('../../../_stdio/shared/components/post/feature-post/utils');
const { slugifyUtils, displayNameUtils } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */


module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      displayNameUtils(data, 'Name');
      slugifyUtils(data, 'DisplayName');
      await syncFeaturedCatalogWithEmptyFields(data.FeatureCatalogs);
      await syncFeaturedPostWithEmptyFields(data.FeaturePosts);
    },
    async beforeUpdate(params, data) {
      displayNameUtils(data, 'Name');
      slugifyUtils(data, 'DisplayName');
      await syncFeaturedCatalogWithEmptyFields(data.FeatureCatalogs);
      await syncFeaturedPostWithEmptyFields(data.FeaturePosts);
    },
  },
};

"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const service = strapi.services['feeling-checkin-contact'];
      data.WhatAmIFeeling = service.generateWhatAmIFeelingResult(data.FeelingCheckinData);
    },
    async beforeUpdate(params, data) {
      const service = strapi.services['feeling-checkin-contact'];
      data.WhatAmIFeeling = service.generateWhatAmIFeelingResult(data.FeelingCheckinData);
    },
  },
};

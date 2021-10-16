'use strict';

const { toSanitizedModel } = require('../../../_stdio/shared/utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async addContact(ctx){
    const body =
      "string" === typeof ctx.request.body
        ? parseBody(ctx.request.body)
        : ctx.request.body;
    const service = strapi.services['feeling-checkin-contact'];
    const entity = await service.addContact(body.contact, body.answers);
    return entity && toSanitizedModel(entity, strapi.models['feeling-checkin-contact']);
  }
};

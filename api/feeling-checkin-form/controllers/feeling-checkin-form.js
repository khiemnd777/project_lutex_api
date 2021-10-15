"use strict";

const { parseBody } = require('../../../_stdio/shared/utils');
const { getFormByName } = require("../services/feeling-checkin-form");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getFormByName(ctx) {
    const service = strapi.services["feeling-checkin-form"];
    const entity = await service.getFormByName(ctx.params.name);
    return (
      entity && {
        _id: entity._id,
        id: entity.id,
        Completed: entity.Completed,
        Name: entity.Name,
        Header: entity.Header,
        Questions: entity.Questions.map((q) => {
          return {
            _id: q._id,
            id: q.id,
            Question: q.Question,
          };
        }),
      }
    );
  },

  async fetchNextForm(ctx) {
    const body =
      "string" === typeof ctx.request.body
        ? parseBody(ctx.request.body)
        : ctx.request.body;
    const service = strapi.services["feeling-checkin-form"];
    return await service.getNextFormByAnswers(body.name, body.answers);
  },
};

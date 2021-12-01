"use strict";

const { parseBody } = require("../../../_stdio/shared/utils");
const { getFormByName } = require("../services/feeling-checkin-form");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

function prepareFormModel(entity) {
  return (
    entity && {
      _id: entity._id,
      id: entity.id,
      Start: entity.Start,
      Completed: entity.Completed,
      ShowContactForm: entity.ShowContactForm,
      Name: entity.Name,
      Header: entity.Header,
      Questions: entity.Questions.map((q) => {
        return {
          _id: q._id,
          id: q.id,
          Question: q.Question,
          Answers: q.Answers,
          Layout: q.Layout,
          MultipleChoice: q.MultipleChoice,
        };
      }),
    }
  );
}

module.exports = {
  async getFormByName(ctx) {
    const service = strapi.services["feeling-checkin-form"];
    const entity = await service.getFormByName(ctx.params.name, true);
    return prepareFormModel(entity);
  },

  async fetchNextForm(ctx) {
    const body =
      "string" === typeof ctx.request.body
        ? parseBody(ctx.request.body)
        : ctx.request.body;
    const service = strapi.services["feeling-checkin-form"];
    const entity = await service.getNextFormByAnswers(body.name, body.answers);
    return prepareFormModel(entity);
  },
};

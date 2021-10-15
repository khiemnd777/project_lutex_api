"use strict";

const { getAnswersByQuestion } = require("../services/feeling-checkin-option");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getAnswersByQuestion(ctx) {
    const service = strapi.services["feeling-checkin-option"];
    const entities = await service.getAnswersByQuestion(ctx.params.questionId);
    return entities.map((ent) => {
      return {
        id: ent.id,
        _id: ent._id,
        Type: ent.Type,
        Name: ent.Name,
        Answer: ent.Answer,
      };
    });
  },
};

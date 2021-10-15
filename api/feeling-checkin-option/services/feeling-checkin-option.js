"use strict";

const { isArray, toSanitizedModel, toSanitizedModels } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getAnswersByQuestion(questionId) {
    const list = await strapi
      .query("feeling-checkin-option")
      .find({ Question: questionId });
    return toSanitizedModels(list, strapi.models['feeling-checkin-option']);
  },
};

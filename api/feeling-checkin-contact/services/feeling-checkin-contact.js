"use strict";

const { isArray } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  generateWhatAmIFeelingResult(data) {
    let result = "";
    if (data) {
      if (data.length) {
        data.forEach((j) => {
          if (j.answers.length) {
            result += `Question: ${j.question} \n`;
            if (j.answers.length === 1) {
              result += `Answer: ${j.answers[0].value} \n`;
              result += `\n`;
              return;
            }
            result += "Answers: \n";
            j.answers.forEach((a) => {
              result += ` - ${a.value} \n`;
            });
            result += `\n`;
          }
        });
      }
      if (result) {
        data.WhatAmIFeeling = result;
      }
    }
    return result;
  },

  async addContact(contact, answers) {
    /**
     * contact: {
     *  FullName: string;
     *  Email: string;
     *  PhoneNumber: string;
     *  Content: string;
     * }
     *
     * answers: {
     *  _v: number;
     *  question: string;
     *  answers: {
     *    value: string;
     *   }[]
     * }[]
     */
    const model = {
      FullName: contact.FullName,
      Email: contact.Email,
      PhoneNumber: contact.PhoneNumber,
      Content: contact.Content,
    };
    if (isArray(answers) && answers.length) {
      model.FeelingCheckinData = JSON.parse(JSON.stringify(answers));
    }
    try {
      model.WhatAmIFeeling = this.generateWhatAmIFeelingResult(
        model.FeelingCheckinData
      );
      const validModel = await strapi.entityValidator.validateEntityCreation(
        strapi.models["feeling-checkin-contact"],
        model
      );
      const entry = await strapi
        .query("feeling-checkin-contact")
        .create(validModel);
      return entry;
    } catch (ex) {
      strapi.log.debug(ex);
      throw ex;
    }
  },
};

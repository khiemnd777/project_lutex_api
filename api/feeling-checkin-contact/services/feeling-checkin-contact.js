"use strict";

const { isArray } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
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
     *   question: string;
     *   answers: {
     *     value: string;
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

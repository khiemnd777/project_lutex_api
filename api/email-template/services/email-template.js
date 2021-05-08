'use strict';

const {isArray, toSanitizedModel} = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const emailTemplate = 'email-template';

module.exports = {
  async getEmailTemplateByName(name) {
    const matchedList = await strapi.query(emailTemplate).find({Name: name}, []);
    return !!matchedList && 
      isArray(matchedList) && 
      !!matchedList.length 
        ? toSanitizedModel(matchedList[0], strapi.models[emailTemplate]) 
        : null;
  },
};

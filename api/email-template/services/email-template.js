"use strict";

const Mustache = require("mustache");
const { isArray, toSanitizedModel } = require("../../../_stdio/shared/utils");
const {
  prepareReplacedTokens,
  buildTokens,
  renderContent,
} = require("../../../_stdio/services/messages/token-builder");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const emailTemplate = "email-template";

module.exports = {
  async getEmailTemplateByName(name) {
    const matchedList = await strapi
      .query(emailTemplate)
      .find({ Name: name }, []);
    return !!matchedList && isArray(matchedList) && !!matchedList.length
      ? toSanitizedModel(matchedList[0], strapi.models[emailTemplate])
      : null;
  },
  async prepareEmailTemplateForSending(name) {
    const emailTemplate = await this.getEmailTemplateByName(name);
    if (emailTemplate) {
      const modelForSending = {
        subject: "",
        body: "",
        bcc: emailTemplate.Bcc,
        sendImmediately: emailTemplate.SendImmediately,
      };
      // Body
      const body = renderContent(emailTemplate.Body);
      modelForSending.body = body;
      // Subject
      const subject = renderContent(emailTemplate.Subject);
      modelForSending.subject = subject;
      return modelForSending;
    }
    return null;
  },
};

"use strict";

const { toSanitizedModel } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async setAllDefaultsToBe(toBeDefault) {
    const emailsAsDefault = await strapi
      .query("email-account")
      .find({ IsDefault: !toBeDefault });
    const emailIds = emailsAsDefault.map((x) => x.id);
    emailIds &&
      Array.isArray(emailIds) &&
      emailIds.forEach(async (emailId) => {
        await strapi
          .query("email-account")
          .update({ id: emailId }, { IsDefault: toBeDefault });
      });
    return emailIds;
  },
  async getEmailAsDefault() {
    const emailsAsDefault = await strapi
      .query("email-account")
      .find({ IsDefault: true });
    if (emailsAsDefault && Array.isArray(emailsAsDefault)) {
      return emailsAsDefault[0];
    }
    return null;
  },
};

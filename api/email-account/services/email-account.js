"use strict";

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
      emailIds.forEach(async (emailId) => {
        await strapi
          .query("email-account")
          .update({ id: emailId }, { IsDefault: toBeDefault });
      });
    return emailIds;
  },
};

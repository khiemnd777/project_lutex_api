"use strict";

const { toSanitizedModel } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const emailAccount = "email-account";

module.exports = {
  async setAllDefaultsToBe(toBeDefault) {
    const emailsAsDefault = await strapi
      .query(emailAccount)
      .find({ IsDefault: !toBeDefault });
    const emailIds = emailsAsDefault.map((x) => x.id);
    emailIds &&
      Array.isArray(emailIds) &&
      emailIds.forEach(async (emailId) => {
        await strapi
          .query(emailAccount)
          .update({ id: emailId }, { IsDefault: toBeDefault });
      });
    return emailIds;
  },
  async getEmailAsDefault() {
    const emailsAsDefault = await strapi
      .query(emailAccount)
      .find({ IsDefault: true });
    if (emailsAsDefault && Array.isArray(emailsAsDefault)) {
      return emailsAsDefault[0];
    }
    return null;
  },
  async getEmailById(emailAccountId) {
    return await strapi.query(emailAccount).findOne({ id: emailAccountId });
  },
  async getEmailByIdOrDefault(emailAccountId) {
    if (emailAccountId) {
      const emailById = await this.getEmailById(emailAccountId);
      if (emailById) return emailById;
    }
    return await this.getEmailAsDefault();
  }
};

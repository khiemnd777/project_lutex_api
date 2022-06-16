"use strict";

const Mustache = require("mustache");
const he = require('he');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async insert(ctx) {
    const body =
      "string" === typeof ctx.request.body
        ? parseBody(ctx.request.body)
        : ctx.request.body;
    // Default email account.
    const emailAccountService = strapi.services["email-account"];
    const defaultEmailAccount = await emailAccountService.getEmailAsDefault();
    if (!defaultEmailAccount) return false;
    const emailTemplateService = strapi.services["email-template"];
    const template = await emailTemplateService.prepareEmailTemplateForSending(body.emailTemplate);
    if(!template) return false;
    const service = strapi.services["queued-email"];
    try {
      await service.insertQueuedEmail({
        From: defaultEmailAccount.Email,
        FromName: defaultEmailAccount.DisplayName,
        To: defaultEmailAccount.Email,
        Subject: Mustache.render(template.subject, body),
        Body: he.decode(Mustache.render(template.body, body)),
        SendImmediately: template.sendImmediately,
        EmailAccount: defaultEmailAccount.id,
      });
      return true;
    } catch (err) {
      return false;
    }
  },
};

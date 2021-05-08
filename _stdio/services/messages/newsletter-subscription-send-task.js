var Mustache = require("mustache");
const { isArray } = require("../../shared/utils");
const {
  extractTokens,
  prepareReplacedTokens,
  buildTokens,
} = require("./token-builder");

module.exports = {
  async execute() {
    const emailTemplateService = strapi.services["email-template"];
    const emailTemplate = await emailTemplateService.getEmailTemplateByName(
      "Newsletter.Subscription"
    );
    if (emailTemplate) {
      const body = emailTemplate.Body;
      let replacedBody = body;
      const builtTokens = await buildTokens(body);
      if (builtTokens) {
        const replacedTokens = prepareReplacedTokens(body);
        if (replacedTokens.length) {
          replacedTokens.forEach((replacedToken) => {
            replacedBody = body.replace(
              replacedToken.token,
              replacedToken.replacedToken
            );
          });
        }
        const bodyWithTokens = Mustache.render(replacedBody, builtTokens);
      }
    }
  },
};

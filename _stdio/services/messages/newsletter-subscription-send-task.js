module.exports = {
  async execute() {
    const subscribersService = strapi.services["subscribers"];
    const emailTemplateService = strapi.services["email-template"];
    const queuedEmailService = strapi.services["queued-email"];
    const emailAccountService = strapi.services["email-account"];
    // Default email account.
    const defaultEmailAccount = await emailAccountService.getEmailAsDefault();
    if (!defaultEmailAccount) return;
    const modelForSending = await emailTemplateService.prepareEmailTemplateForSending(
      "Newsletter.Subscription"
    );
    if (!modelForSending) return;
    // Subcribers.
    const subscribers = await subscribersService.find();
    if (!subscribers.length) return;
    // Email template.
    await Promise.all(subscribers.map(async (subscriber) => {
      try {
        await queuedEmailService.insertQueuedEmail({
          From: defaultEmailAccount.Email,
          FromName: defaultEmailAccount.DisplayName,
          To: subscriber.Email,
          Bcc: modelForSending.bcc,
          Subject: modelForSending.subject,
          Body: modelForSending.body,
          SendImmediately: modelForSending.sendImmediately,
          EmailAccount: defaultEmailAccount.id,
        });
      } catch (ex) {
        strapi.log.debug(ex);
      }
    }));
  },
};

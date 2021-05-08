"use strict";

const newsletterSubscriptionSendTask = require("../../_stdio/services/messages/newsletter-subscription-send-task");
const queuedEmailSendTask = require("../../_stdio/services/messages/queued-email-send-task");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */
module.exports = {
  /** 
   * Queued email send task
   * Every 1 minute
   */ 
  "0 1 * * * *": {
    task: () => {
      strapi.log.debug("Queued email sending...");
      queuedEmailSendTask.execute();
    },
  },
  /**
   * Newsletter subscription task
   * Every monday at 5am
   */
  "0 0 5 * * 1": {
    task: () => {
      newsletterSubscriptionSendTask.execute();
    },
  },
};

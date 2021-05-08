"use strict";

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
  // Queued email send task
  "0 1 * * * *": {
    task: () => {
      queuedEmailSendTask.execute(3);
    },
  },
};

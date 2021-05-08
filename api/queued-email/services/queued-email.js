"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { toSanitizedModels } = require("../../../_stdio/shared/utils");

const queuedEmail = "queued-email";

module.exports = {
  async insertQueuedEmail(data) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models[queuedEmail],
      data
    );
    const entry = await strapi.query(queuedEmail).create(validData);
    return entry;
  },
  async updateQueuedEmail(params, data) {
    try {
      const validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models[queuedEmail],
        data
      );
      const entry = await strapi.query(queuedEmail).update(params, validData);
      return entry;
    } catch (ex) {
      strapi.log.debug(ex);
    }
  },
  async deleteQueuedEmail(params) {
    await strapi.query(queuedEmail).delete(params);
  },
  async searchEmails(
    from,
    to,
    loadNotSentItemsYetOnly,
    maxSendTries,
    loadNewest,
    pageIndex,
    pageSize
  ) {
    const params = {};
    if (from) {
      params["From"] = from;
    }
    if (to) {
      params["To"] = to;
    }
    if ("undefined" !== typeof maxSendTries) {
      params["_where"] = {
        _or: [{ SendTries_null: true }, { SendTries_lt: maxSendTries }],
      };
    }
    if (loadNewest) {
      params["_sort"] = "createdAt:desc";
    }
    if ("undefined" !== typeof pageIndex) {
      params["_start"] = pageIndex;
    }
    if ("undefined" !== typeof pageSize) {
      params["_limit"] = pageSize;
    }
    if (loadNotSentItemsYetOnly) {
      params["SentOn_null"] = true;
    }
    const entries = await strapi.query(queuedEmail).find(params);
    return toSanitizedModels(entries, strapi.models[queuedEmail]);
  },
};

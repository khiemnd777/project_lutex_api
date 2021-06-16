"use strict";

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const _ = require("lodash");

module.exports = {
  async refreshToken(ctx) {
    const params = _.assign(ctx.request.body);
    // Parse Token
    try {
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.verify(params.jwt);
      const user = await strapi
        .query("user", "users-permissions")
        .findOne({ id });
      ctx.send({
        jwt: strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id,
        }),
      });
    } catch (e) {
      return ctx.badRequest(null, "Invalid token");
    }
  },
};

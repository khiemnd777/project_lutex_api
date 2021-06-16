"use strict";

const { parseBody } = require("../../../_stdio/shared/utils");
const WidgetInstaller = require("../../../_stdio/services/widget/widget-installer");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async setup(ctx) {
    const body = 'string' === typeof ctx.request.body ? parseBody(ctx.request.body) : ctx.request.body;
    const installer = new WidgetInstaller();
    return await installer.Setup(body);
  },
  async upgrade(ctx) {
    const body = 'string' === typeof ctx.request.body ? parseBody(ctx.request.body) : ctx.request.body;
    const installer = new WidgetInstaller();
    return await installer.Upgrade(body);
  },
  async uninstall(ctx) {
    const body = 'string' === typeof ctx.request.body ? parseBody(ctx.request.body) : ctx.request.body;
    const installer = new WidgetInstaller();
    return await installer.Uninstall(body);
  },
  async exists(ctx) {
    const params = ctx.params;
    if ("undefined" === typeof params.name) {
      throw new Error(`The query name must be defined`);
    }
    const service = strapi.services["widget"];
    return await service.existsWidget(params.name);
  },
};

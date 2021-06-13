"use strict";

const { parseBody } = require("../../../_stdio/shared/utils");
const WidgetInstaller = require("../../../_stdio/services/widget/widget-installer");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async setup(ctx) {
    const body = parseBody(ctx.request.body);
    const installer = new WidgetInstaller();
    installer.Setup(body);
  },
  async uninstall(ctx) {
    const body = parseBody(ctx.request.body);
    const installer = new WidgetInstaller();
    installer.Uninstall(body);
  },
  async exists(ctx) {
    const query = ctx.query;
    if ('undefined' === typeof query.name) {
      throw new Error(`The query name must be defined`);
    }
    const service = strapi.services["widget"];
    let showHidden = false;
    if (ctx.state.user && ctx.state.user.role.Name === "Administrator") {
      showHidden = true;
    }
    return service.existsWidget(query.name, showHidden);
  },
};

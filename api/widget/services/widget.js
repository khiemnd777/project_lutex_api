"use strict";

const { cloneObject } = require("../../../_stdio/shared/utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const widget = "widget";

// {
//   Name: "",
//   FriendlyName: "",
//   ConfigurationName: "",
//   Parameters: [{
//    Name: "",
//    Value: "",
//  }],
// };

module.exports = {
  async insertWidget(model) {
    try {
      const validModel = await strapi.entityValidator.validateEntityCreation(
        strapi.models[widget],
        model
      );
      strapi.log.debug(JSON.stringify(validModel));
      const entry = await strapi.query(widget).create(validModel);
      return entry;
    } catch (ex) {
      strapi.log.debug(ex);
      throw ex;
    }
  },
  async updateWidgetById(id, model) {
    try {
      const validModel = await strapi.entityValidator.validateEntityUpdate(
        strapi.models[widget],
        model
      );
      const entry = await strapi.query(widget).update({ id: id }, validModel);
      return entry;
    } catch (ex) {
      strapi.log.debug(ex);
      throw ex;
    }
  },
  async updateWidgetByName(name, model) {
    try {
      const validModel = await strapi.entityValidator.validateEntityUpdate(
        strapi.models[widget],
        model
      );
      const entry = await strapi
        .query(widget)
        .update({ Name: name }, validModel);
      return entry;
    } catch (ex) {
      strapi.log.debug(ex);
      throw ex;
    }
  },
  async updateWidgetParameters(name, params) {
    const foundWidget = await strapi.query(widget).findOne({ Name: name });
    if (foundWidget) {
      try {
        const widgetParameters = foundWidget.Parameters;
        const resultParams = widgetParameters.map((x) => {
          return {
            Name: x.Name,
            Value: x.Value,
          };
        });
        params && params.forEach((param) => {
          if (
            resultParams.every((widgetParam) => widgetParam.Name !== param.Name)
          ) {
            resultParams.push(cloneObject(param));
          }
        });
        return await this.updateWidgetByName(name, {
          Parameters: resultParams,
        });
      } catch (ex) {
        throw ex;
      }
    }
    return null;
  },
  async publishWidget(name, published) {
    await strapi
      .query(widget)
      .update({ Name: name }, { published_at: published ? new Date() : null });
  },
  async existsWidget(name, showHidden) {
    const foundWidgets = await strapi
      .query(widget)
      .find({ Name: name, published_at_null: !!showHidden });
    return Array.isArray(foundWidgets) && foundWidgets.length > 0;
  },
  async deleteWidgetByName(name) {
    await strapi.query(widget).delete({ Name: name });
  },
  async deleteWidgetById(id) {
    await strapi.query(widget).delete({ id: id });
  },
};

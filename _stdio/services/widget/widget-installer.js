class WidgetInstaller {
  constructor() {}
  async Setup(model) {
    const widgetService = await strapi.services["widget"];
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const existed = await widgetService.existsWidget(model.Name, true);
    if (existed) {
      await this.Upgrade(model);
    } else {
      await widgetService.insertWidget(model);
    }
    await widgetService.publishWidget(model.Name, true);
    return model;
  }
  async Upgrade(model) {
    const widgetService = await strapi.services["widget"];
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const existed = await widgetService.existsWidget(model.Name, true);
    if (existed) {
      await widgetService.updateWidgetParameters(model.Name, model.Parameters);
    }
    return model;
  }
  async Uninstall(model) {
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const widgetService = await strapi.services["widget"];
    await widgetService.publishWidget(model.Name, false);
    return model;
  }
}

module.exports = WidgetInstaller;

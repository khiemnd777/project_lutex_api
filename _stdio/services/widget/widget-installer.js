class WidgetInstaller {
  constructor() {}
  async Setup(model) {
    const widgetService = await strapi.services["widget"];
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const existed = await widgetService.existsWidget(model.Name);
    if (existed) {
      await this.Upgrade(model);
    } else {
      await widgetService.insertWidget(model);
    }
    await widgetService.publishWidget(model.Name, true);
  }
  async Upgrade(model) {
    const widgetService = await strapi.services["widget"];
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const existed = await widgetService.existsWidget(model.Name);
    if (existed) {
      await widgetService.updateWidgetParameters(model.Name, model.Parameters);
    }
  }
  async Uninstall(model) {
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const widgetService = await strapi.services["widget"];
    await widgetService.publishWidget(model.Name, false);
  }
}

module.exports = WidgetInstaller;

class WidgetInstall {
  constructor() {}
  async Setup(model) {
    const widgetService = await strapi.services["widget"];
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const existed = await widgetService.existsWidget(model.Name);
    if (existed) {
      await widgetService.updateWidgetByName(model.Name, model);
    } else {
      await widgetService.insertWidget(model);
    }
    await widgetService.publishWidget(model.Name, true);
  }
  async Uninstall(model) {
    if (!model.Name) {
      throw new Error(`Widget's Name must be set a value.`);
    }
    const widgetService = await strapi.services["widget"];
    await widgetService.publishWidget(model.Name, false);
  }
}

module.exports = WidgetInstall;

const { isArray } = require("../../shared/utils");

const syncWidgetWithEmptyFields = async (widgets) => {
  if (isArray(widgets)) {
    await Promise.all(
      widgets
        .filter((widget) => widget.Update)
        .map(async (widget) => {
          widget.Update = false;
          if (widget.widget) {
            const matchedWidget = await strapi
              .query("widget")
              .findOne({ id: widget.widget });
            if (matchedWidget) {
              // Name
              if (!widget.Name) {
                matchedWidget.Name && (widget.Name = matchedWidget.Name);
              }
              // Configuration Name
              if (!widget.ConfigurationName) {
                matchedWidget.ConfigurationName &&
                  (widget.ConfigurationName = matchedWidget.ConfigurationName);
              }
              // Add or Update Parameters
              if (isArray(matchedWidget.Parameters)) {
                if (!isArray(widget.Parameters)) {
                  widget.Parameters = [];
                }
                matchedWidget.Parameters.forEach((p) => {
                  const foundWp = widget.Parameters.find(
                    (wp) => wp.Name === p.Name
                  );
                  if (foundWp && !foundWp.Value) {
                    foundWp.Value = p.Value;
                  }
                  if (!foundWp) {
                    widget.Parameters.push({
                      Name: p.Name,
                      Value: p.Value,
                    });
                  }
                });
              }
            }
          }
        })
    );
  }
};

module.exports = {
  syncWidgetWithEmptyFields,
};

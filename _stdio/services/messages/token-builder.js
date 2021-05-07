const { firstOrDefault, isArray } = require("../../shared/utils");

const buildTokenCollection = (tokenizedData) => {
  if (isArray(tokenizedData)) {
    tokenizedData.forEach((token) => {
      for (const key in token) {
        const tokenizedValue = token[key];
        // if is array
        if (isArray(tokenizedValue)) {
          continue;
        }
        // if is object
        if ("object" === typeof tokenizedValue) {
          continue;
        }
        // the other ways.
      }
    })
  }
  return null;
};

const buildToken = async (tokenName, tokenizedData) => {
  const tokenTemplate = await firstOrDefault("token-template", { Name: tokenName });
  if (tokenTemplate) {
    const body = tokenTemplate.Body
    switch (tokenTemplate.ContentType) {
      case "Collection": {
        return buildTokenCollection(tokenTemplate, tokenizedData);
      }
      case "Single": {

      }
        break;
    }
  }
};

module.exports = {
  buildToken
};

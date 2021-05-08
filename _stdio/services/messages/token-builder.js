const Mustache = require("mustache");
const { isArray } = require("../../shared/utils");
const tokenizer = require("./tokenizer");

const extractTokens = (content) => {
  const regex = new RegExp(/%[@a-zA-Z\d:=\.]+%/g);
  let list = [];
  const tokens = {};
  while ((list = regex.exec(content)) !== null) {
    if (isArray(list)) {
      list.forEach((token) => {
        let predicatedToken = token.replace(/^%/g, "").replace(/%$/, "");
        if (!tokens[predicatedToken]) {
          const splittedToken = predicatedToken.split("::");
          const tokenFunc = splittedToken[0];
          const splittedTokenResult = {
            tokenFunc: tokenFunc,
            tokenParams: [],
          };
          // assign to tokens
          tokens[predicatedToken] = splittedTokenResult;
          // parameters
          if (splittedToken.length > 1) {
            for (let inx = 1; inx < splittedToken.length; inx++) {
              const tokenParam = splittedToken[inx];
              const splittedTokenParam = tokenParam.split("=");
              splittedTokenResult.tokenParams.push({
                name: splittedTokenParam[0],
                value:
                  splittedTokenParam.length > 1
                    ? splittedTokenParam[1]
                    : undefined,
              });
            }
          }
        }
      });
    }
  }
  return tokens;
};

const prepareReplacedTokens = (content) => {
  const result = [];
  const regex = new RegExp(/%[@a-zA-Z\d:=\.]+%/g);
  while ((list = regex.exec(content)) !== null) {
    if (isArray(list)) {
      Array.prototype.push.apply(result, list.map((token) => {
        return {
          token: token,
          replacedToken: token.replace(/^%/g, "").replace(/%$/, ""),
        };
      }));
    }
  }
  return result;
};

const buildTokens = async (content) => {
  const tokens = extractTokens(content);
  if (tokens) {
    const builtToken = {};
    for (const key in tokens) {
      const token = tokens[key];
      const tokenFunc = token.tokenFunc;
      if (tokenFunc) {
        const splittedTokenFunc = tokenFunc.split(".");
        if (splittedTokenFunc.length > 1) {
          const workspaceName = splittedTokenFunc[0];
          const workspace = tokenizer[workspaceName];
          if (workspace) {
            builtToken[workspaceName] = {};
            const workspaceFunc = workspace[splittedTokenFunc[1]];
            if ("function" === typeof workspaceFunc) {
              const tokenParams = token.tokenParams;
              let params = [];
              let tokenParamsStr = "";
              if (tokenParams.length) {
                params = tokenParams.map((tokenParam) => tokenParam.value);
                const tokenParamStrList = tokenParams.map(
                  (tokenParam) => `${tokenParam.name}=${tokenParam.value}`
                );
                tokenParamsStr = `::${tokenParamStrList.join("::")}`;
              }
              const execWorkspaceFunc = params.length
                ? workspaceFunc.apply(null, params)
                : workspaceFunc();
              if (execWorkspaceFunc instanceof Promise) {
                const resultWorkspaceFunc = await execWorkspaceFunc;
                builtToken[workspaceName][
                  `${splittedTokenFunc[1]}${tokenParamsStr}`
                ] = resultWorkspaceFunc;
              } else {
                builtToken[workspace][
                  `${splittedTokenFunc[1]}${tokenParamsStr}`
                ] = execWorkspaceFunc;
              }
            }
          }
        }
      }
    }
    return builtToken;
  }
  return null;
};

const renderContent = async (content) => {
  let replacedContent = content;
  const contentBuiltTokens = await buildTokens(content);
  if (contentBuiltTokens) {
    const replacedTokens = prepareReplacedTokens(content);
    if (replacedTokens.length) {
      replacedTokens.forEach((replacedToken) => {
        replacedContent = replacedContent.replace(
          replacedToken.token,
          replacedToken.replacedToken
        );
      });
    }
    return Mustache.render(replacedContent, contentBuiltTokens);
  }
  return replacedContent;
};

module.exports = {
  prepareReplacedTokens,
  extractTokens,
  buildTokens,
  renderContent,
};

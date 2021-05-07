const { firstOrDefault, isArray } = require("../../shared/utils");
const tokenizer = require("./tokenizer");

const extractTokens = (content) => {
  const regex = new RegExp(/%[@a-zA-Z\d:=\.]+%/g);
  const list = regex.exec(content);
  if (isArray(list)) {
    const tokens = {};
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
    return tokens;
  }
  return null;
};

const prepareReplacedTokens = (content) => {
  const regex = new RegExp(/%[@a-zA-Z\d:=\.]+%/g);
  const list = regex.exec(content);
  if (isArray(list)) {
    return list.map((token) => {
      return {
        token: token,
        replacedToken: token.replace(/^%/g, "").replace(/%$/, ""),
      };
    });
  }
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
            builtToken[workspace] = {};
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
                builtToken[workspace][
                  `${workspaceFunc}${tokenParamsStr}`
                ] = resultWorkspaceFunc;
              } else {
                builtToken[workspace][
                  `${workspaceFunc}${tokenParamsStr}`
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

module.exports = {
  prepareReplacedTokens,
  extractTokens,
  buildTokens,
};

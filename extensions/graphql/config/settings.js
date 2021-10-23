const responseCachePlugin = require("apollo-server-plugin-response-cache");
const { BaseRedisCache } = require("apollo-server-cache-redis");
const Redis = require("ioredis");

// set this to whatever you believe should be the max age for your cache control
const MAX_AGE = 60;

module.exports = {
  federation: false,
  apolloServer: {
    tracing: "production" !== strapi.config.environment ? true : false,
    persistedQueries: { ttl: 10 * MAX_AGE }, // we set this to be a factor of 10, somewhat arbitrary
    cacheControl: { defaultMaxAge: MAX_AGE },
    plugins: [
      responseCachePlugin({
        shouldReadFromCache,
        shouldWriteToCache,
        extraCacheKeyData,
        sessionId,
      }),
      injectCacheControl(),
    ],
  },
};

if ("development" !== strapi.config.environment && process.env.REDIS_URL) {
  const redisParams = process.env.REDIS_URL.split(':');
  const cache = new BaseRedisCache({
    client: new Redis({
      host: redisParams[0],
      port: redisParams[1] ? parseInt(redisParams[1]) : 6379,
    }),
  });
  module.exports.apolloServer.cache = cache;
  module.exports.apolloServer.persistedQueries.cache = cache;
}

async function sessionId(requestContext) {
  // return a session ID here, if there is one for this request
  return null;
}

async function shouldReadFromCache(requestContext) {
  // decide if we should write to the cache in this request
  const operationName = requestContext.request.operationName;
  if (operationName) {
    if (operationName.match(/_no_*[Cc]ache$/i)) {
      return false;
    }
  }
  return true;
}

async function shouldWriteToCache(requestContext) {
  // decide if we should write to the cache in this request
  const operationName = requestContext.request.operationName;
  if (operationName) {
    if (operationName.match(/_no_*[Cc]ache$/i)) {
      return false;
    }
  }
  return true;
}

async function extraCacheKeyData(requestContext) {
  // use this to create any extra data that can be used for the cache key
}

function injectCacheControl() {
  return {
    requestDidStart(requestContext) {
      requestContext.overallCachePolicy = {
        scope: "PUBLIC", // or 'PRIVATE'
        maxAge: MAX_AGE,
      };
    },
  };
}

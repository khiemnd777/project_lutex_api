module.exports = ({ env }) => {
  const redisUrl = env("REDIS_URL");
  const redisHost = redisUrl?.split(":")[0];
  const redisPort = redisUrl?.split(":")[1];
  return {
    settings: {
      cache: {
        enabled: env.bool("CACHE_ENABLED", false),
        populateStrapiMiddleware: true,
        models: [
          {
            model: "router",
            maxAge: 432000000,
          },
          {
            model: "template",
            maxAge: 432000000,
          },
        ],
        type: redisUrl ? "redis" : "mem",
        maxAge: env.int("REDIS_MAX_AGE", 3600000),
        redisConfig: {
          host: redisHost,
          port: parseInt(redisPort),
        },
      },
    },
  };
};

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  cron: { enabled: env.bool("CRON_ENABLED") },
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "f228183792b3b18ce7173b1dfac84503"),
    },
  },
});

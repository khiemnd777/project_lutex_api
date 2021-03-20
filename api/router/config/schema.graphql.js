module.exports = {
  definition: `
    type Router2 {
      Path: String!
    }
  `,
  query: `
    routers2: [Router2]!
  `,
  resolver: {
    Query: {
      routers2: {
        resolverOf: "application::router.router.find",
        resolver: "application::router.router.find",
      },
    },
  },
};

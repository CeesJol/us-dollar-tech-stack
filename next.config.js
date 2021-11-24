module.exports = {
  reactStrictMode: true,
  env: {
    APP_NAME: "US-Dollar-Tech-Stack",
    FAUNADB_SECRET_KEY: process.env.FAUNADB_SECRET_KEY,
    FAUNADB_GRAPHQL_ENDPOINT: "https://graphql.eu.fauna.com/graphql",
    ABLY_API_KEY: process.env.ABLY_API_KEY,
  },
};

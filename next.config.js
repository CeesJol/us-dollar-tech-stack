module.exports = {
  reactStrictMode: true,
  env: {
    APP_NAME: "Transport Game",
    FAUNADB_SECRET_KEY: process.env.FAUNADB_SECRET_KEY,
    FAUNADB_GRAPHQL_ENDPOINT: "https://graphql.eu.fauna.com/graphql",
  },
};

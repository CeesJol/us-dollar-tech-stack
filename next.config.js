module.exports = {
  reactStrictMode: true,
  env: {
    APP_NAME: "US-Dollar-Tech-Stack",
    APP_DESCRIPTION: "A tech stack for a quick web development project.",
    FAUNADB_SECRET_KEY: process.env.FAUNADB_SECRET_KEY,
    FAUNADB_GRAPHQL_ENDPOINT: "https://graphql.eu.fauna.com/graphql",
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
  },
};

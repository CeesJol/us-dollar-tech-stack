# US-Dollar-Tech-Stack Boilerplate

This is a boilerplate for a quick web development project.

## Technologies used

- **Framework**: Next.js (React, TypeScript), hosted at Vercel
- **Realtime**: Ably
- **DB**: FaunaDB (data API), GraphQL
- **Styling**: SCSS

## Features

- React context for state management
- Authentication with FaunaDB and a JWT in a cookie
- REST API to send POST requests with a GraphQL query/mutation as body

## Getting started

- FaunaDB
  - Create an account
  - Create a database, call it `apple-pie`, set Region to `Europe`\*
  - In the next steps, you will need your copy pasta skills
  - Go the the GraphQl tab, and import the `schema.gql`
  - Go to the Functions tab, and add each function from `fauna/functions`
  - Go the the Shell tab, and add the role: `fauna/roles/user.fql`
  - Go the the Security tab, and create an API key (for the .env file, see below)
- Ably
  - Create an account
  - Click on "Create New App", call it `falafel-toast`
  - Create an API key (for the .env file, see below)
- Create a .env file an fill in the following values:
  - FAUNADB_SECRET_KEY=""
    - _the FaunaDB key you created earlier_
  - ABLY_API_KEY=""
    - _the Ably key you created earlier_
  - COOKIE_SECRET=""
    - _type in anything_
- The project
  - To install packages: run `yarn install`
  - To start the server: run `yarn dev` (you need to restart this if you change the `.env` file!)
  - You might get some errors when you start for the first time, just refresh. Shrug emoji.
  - If you still get errors --> _good luck!_

\* Other regions are also possible, but then you need to change the `FAUNADB_GRAPHQL_ENDPOINT` in `next.config.js`.

## Deploying

1. Go to Vercel
2. Connect to Github
3. Import from GitHub, keep the default settings
4. Fill in your `.env` variables from earlier
5. Hit deploy
6. Eat a mango
7. Done!

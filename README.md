# US-Dollar-Tech-Stack Boilerplate

This is a boilerplate for a quick web development project.

## Getting started

- FaunaDB
  - Create an account
  - Import the `schema.gql`
  - Add each function from `fauna/functions`
  - Add the roles from `fauna/roles/user.fql`
  - Create an API key (for the .env file, see below)
- Ably
  - Create an account
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

## Technologies used

- **Framework**: Next.js (React, TypeScript), hosted at Vercel
- **Realtime**: Ably
- **DB**: FaunaDB (data API), GraphQL
- **Styling**: SCSS

## Features

- React context for state management
- Authentication with FaunaDB and a JWT in a cookie
- REST API to send POST requests with a GraphQL query/mutation as body

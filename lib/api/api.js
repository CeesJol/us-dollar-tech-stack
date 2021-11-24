import { fetchFromAPI } from "./api-helpers";

/**
 * API used to communicate with the database.
 */
export const fauna = (body) => {
  return fetchFromAPI(body, "fauna");
};

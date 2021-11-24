/**
 * Handle errors
 */
export const handleErrors = (errors) => {
  const result = [];

  for (var error of errors) {
    const message =
      error.message || error.description || error.validationMessage;
    switch (message) {
      case "Instance is not unique.":
        result.push({
          ...error,
          msg: "An account with that email address already exists.",
        });
        break;
      case "The instance was not found or provided password was incorrect.":
        result.push({
          ...error,
          msg: "Incorrect email or password.",
        });
        break;
      default:
        if (error.validationMessage) {
          // Validation error
          result.push({ msg: message });
        } else {
          result.push({
            ...error,
            msg: "A server side error occurred. Please try again later.",
          });
        }
    }
  }

  return result;
};

/**
 * Function to send HTTP request to API.
 */
export const fetchFromAPI = async (body, route) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(`/api/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await data.json();
      if (json[0]) {
        return reject(handleErrors(json));
      } else {
        return resolve(json);
      }
    } catch (err) {
      return reject("fetchFromAPI error" + err);
    }
  });
};

/**
 * Function to send queries to the database.
 */
export const executeQuery = async (query, userSecret) => {
  console.info("===== QUERY =====\n", query, "\n===== RESULT ====");
  try {
    // Local (docker) fetch url: "http://localhost:8084/graphql"
    const res = await fetch(process.env.FAUNADB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userSecret}`,
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
    const data = await res.json();
    if (!data) {
      console.info("ERROR: no data\n=================\n");
      return [{ message: "No data was returned from executeQuery" }];
    } else if (data.errors) {
      console.info(data.errors);
      console.info("Query result: ERROR: errors\n=================\n");
      return data.errors;
    } else if (isEmptyReturnObject(data.data)) {
      console.info(data.data);
      console.info(
        "Query result: ERROR: empty return object\n=================\n"
      );
      return [{ message: "This item no longer exists. " }];
    }
    console.info(data.data);
    console.info("Query result: SUCCESS\n=================\n");
    return data.data;
  } catch (err) {
    console.info(err);
    console.info("Query result: EXECUTEQUERY ERROR\n=================\n");
    return [{ message: "executeQuery error " + err }];
  }
};

/**
 * Check if every key in object is null
 * Used to see if a GraphQL query returned no data, indicating that
 * something went wrong, like the object no longer exists
 * Source: https://stackoverflow.com/questions/27709636/determining-if-all-attributes-on-a-javascript-object-are-null-or-an-empty-string
 */
export const isEmptyReturnObject = (obj) => {
  for (var key in obj) {
    if (obj[key] !== null) {
      return false;
    }
  }
  return true;
};

/**
 * Create a tuple of (pairs, keys) that can be used in a GraphQL query.
 * The "pairs" hold keys and values, the "keys" hold just the keys.
 * e.g.,
 * const { pairs, keys } = stringifyObject(data);
 * mutation UpdateUser {
 *		updateUser(id: "${id}", data: {
 *			${pairs}
 *		}) {
 *			${keys}
 *		}
 *	}
 */
export const stringifyObject = (data) => {
  // Convert object to array of (key, value) pairs
  let entries = Object.entries(data);

  let keys = ""; // keys
  let pairs = ""; // (key, value) pairs

  for (let item of entries) {
    // Skip _id
    if (item[0] === "_id") {
      keys += item[0] + "\n";
      continue;
    }

    // JSON.Stringify resume data
    if (item[0] === "data") {
      item[1] = JSON.stringify(item[1]);
    }

    // Skip connects (objects)
    if (typeof item[1] === "object") {
      continue;
    }

    if (typeof item[1] === "number" || typeof item[1] === "boolean") {
      // Don't stringify integers and booleans
      keys += item[0] + "\n";
      pairs += item[0] + ": " + item[1] + "\n";
    } else {
      // Stringify all others
      keys += item[0] + "\n";

      // Append strings ending with " with a space to prevent bug
      if (item[1].endsWith('"')) {
        item[1] = item[1] + " ";
      }
      pairs += item[0] + ': """' + item[1] + '"""\n';
    }
  }

  return { pairs, keys };
};

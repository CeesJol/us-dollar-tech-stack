import { stringifyObject, executeQuery } from "../../lib/api/api-helpers";
import { COOKIE_MAX_AGE } from "../../lib/constants";
import jwt from "jsonwebtoken";
import {
  validateSignup,
  validateLogin,
  validatePassword,
} from "../../lib/validate";

// User data request data used by getUserByEmail and readUser
const USER_DATA: string = `_id
username
email
confirmed
`;

/** |----------------------------
 *  | USER
 *  |----------------------------
 */
export const loginUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.info("loginUser request");
  email = email.toLowerCase();
  const validationError = validateLogin(email, password);
  if (validationError) return [{ validationError }];
  return executeQuery(
    `mutation LoginUser {
			loginUser(email:"${email}", password: "${password}") {
				token
				user {
					${USER_DATA}
				}
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const logoutUser = (secret: string) => {
  console.info("logoutUser request");
  return executeQuery(
    `mutation LogoutUser {
			logoutUser
		}`,
    secret
  );
};

export const createUser = ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  console.info("createUser request");
  email = email.toLowerCase();
  const validationError = validateSignup(email, username, password);
  if (validationError) return [{ validationError }];
  return executeQuery(
    `mutation CreateUser {
			createUser(email: "${email}", username: "${username}", password: "${password}") {
				_id
				username
				email
				confirmed
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const updateUserPassword = (
  { id, password }: { id: string; password: string },
  secret: string
) => {
  console.info("updateUserPassword request");
  const validationError = validatePassword(password);
  if (validationError) return [{ validationError }];
  return executeQuery(
    `mutation UpdateUserPassword {
			updateUserPassword(id: "${id}", password: "${password}") {
				_id
				username
				email
				confirmed
			}
		}`,
    secret
  );
};

export const updateUserPasswordNoSecret = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  console.info("updateUserPasswordNoSecret request");
  try {
    const validationError = validatePassword(password);
    if (validationError) return [{ validationError }];
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;
    return executeQuery(
      `mutation UpdateUserPassword {
			updateUserPassword(id: "${id}", password: "${password}") {
				_id
				username
        email
				confirmed
			}
		}`,
      process.env.FAUNADB_SECRET_KEY
    );
  } catch (err) {
    return [{ message: "Reset password error: " + err }];
  }
};

export const updateUser = async (
  { id, data }: { id: string; data: any },
  secret: string
) => {
  console.info("updateUser request", id, data);
  if (data.email) data.email.toLowerCase();
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateUser {
			updateUser(id: "${id}", data: {
				${pairs}
			}) {
				${keys}
			}
		}`,
    secret
  );
};

export const readUser = async ({ id }: { id: string }, secret: string) => {
  console.info("readUser request");
  return executeQuery(
    `query FindAUserByID {
			findUserByID(id: "${id}") {
				${USER_DATA}
			}
		}`,
    secret
  );
};

export const getUserByEmail = async (
  { email }: { email: string },
  secret: string
) => {
  console.info("getUserByEmail request");
  email = email.toLowerCase();
  return executeQuery(
    `query FindAUserByEmail {
			userByEmail(email: "${email}") {
				${USER_DATA}
			}
		}`,
    secret
  );
};

export const confirmUser = async (
  { token }: { token: string },
  secret: string
) => {
  console.info("confirmUser request");
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;
    return executeQuery(
      `mutation UpdateUser {
				updateUser(id: "${id}", data: {
					confirmed: true
				}) {
					confirmed
				}
			}`,
      secret
    );
  } catch (err) {
    return [{ message: "Confirm user error: " + err }];
  }
};

export const checkUserEmail = async ({ email }: { email: string }) => {
  console.info("checkUserEmail request");
  return executeQuery(
    `query {
			userByEmail(email: "${email}") {
				_id
				email
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

/** |----------------------------
 *  | MISC
 *  |----------------------------
 */
export const faultyQuery = async () => {
  console.info("faultyQuery request");
  // try {
  //   throw new Error("NO.");
  // } catch (err) {
  //   return [{ message: "Confirm user error: " + err }];
  // }

  return executeQuery(
    `query PlausibleError{
			plausibleError {
				_id
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const testMutation = ({ name }: { name: string }) => {
  console.info("testMutation request");
  return executeQuery(
    `mutation CreateTest {
      createTest(data:{name: "${name}"}) {
        _id
        name
      }
    }`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const testQuery = () => {
  console.info("testQuery request");
  return executeQuery(
    `query TestData {
      testData {
        data {
          _id
          name
        }
      }
    }`,
    process.env.FAUNADB_SECRET_KEY
  );
};

// Source
// https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name: string, cookies: string) {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const fauna = async (req, res) => {
  const deleteCookie = () => {
    // Delete secret cookie
    res.setHeader("Set-Cookie", [
      `secret=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);
  };
  const userSecretEncrypted = getCookie("secret", req.headers.cookie);
  let userSecret;
  let result;
  if (userSecretEncrypted) {
    try {
      userSecret = jwt.verify(
        userSecretEncrypted,
        process.env.COOKIE_SECRET
      ).token;
    } catch (e) {
      console.error("Error: invalid authentication token: ", e);
      deleteCookie();
      result = [{ message: "Error: invalid authentication token" }];
      res.end(JSON.stringify(result));
      return;
    }
  }
  const { type, ...body } = req.body;

  try {
    switch (type) {
      // ----------
      // USERS
      // ----------
      case "LOGIN_USER":
        result = await loginUser(body);
        // If no validation error, set cookie
        if (!result[0]) {
          // Set secret cookie
          const encryptedToken = jwt.sign(
            {
              token: result.loginUser.token,
            },
            process.env.COOKIE_SECRET
          );
          res.setHeader("Set-Cookie", [
            `secret=${encryptedToken}; HttpOnly; Max-Age=${COOKIE_MAX_AGE}`,
          ]);
          // Don't send token to user
          result = result.loginUser.user;
        }
        break;
      case "LOGOUT_USER":
        result = await logoutUser(userSecret);
        deleteCookie();
        break;
      case "CREATE_USER":
        result = await createUser(body);
        break;
      case "UPDATE_USER_PASSWORD":
        result = await updateUserPassword(body, userSecret);
        break;
      case "UPDATE_USER_PASSWORD_NO_SECRET":
        result = await updateUserPasswordNoSecret(body);
        break;
      case "UPDATE_USER":
        result = await updateUser(body, userSecret);
        break;
      case "READ_USER":
        result = await readUser(body, userSecret);
        break;
      case "GET_USER_BY_EMAIL":
        result = await getUserByEmail(body, userSecret);
        break;
      case "CONFIRM_USER":
        result = await confirmUser(body, userSecret);
        break;
      case "CHECK_USER_EMAIL":
        result = await checkUserEmail(body);
        break;
      // ----------
      // MISC
      // ----------
      case "FAULTY_QUERY":
        result = await faultyQuery();
        break;
      case "TEST_MUTATION":
        result = await testMutation(body);
        break;
      case "TEST_QUERY":
        result = await testQuery();
        break;
      default:
        result = [{ message: "Error: No such type in /api/fauna: " + type }];
    }
  } catch (e) {
    // Stringify error message
    // Source: https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
    if (!("toJSON" in Error.prototype))
      Object.defineProperty(Error.prototype, "toJSON", {
        value: function () {
          var alt = {};

          Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
          }, this);

          return alt;
        },
        configurable: true,
        writable: true,
      });

    console.error("API err:", e);
    result = [{ message: e }];
  }
  res.end(JSON.stringify(result));
};

export default fauna;

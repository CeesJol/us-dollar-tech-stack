import React, { createContext, useState, useEffect } from "react";
import { fauna } from "../lib/api/api";
import { toastError } from "../lib/error";

type ContextType = {
  user: any | null;
  storeUser: (data: any) => void;
  clearUser: () => void;
  userExists: () => boolean;
  handleLogin: (email: string, password: string) => void;
  handleSignup: (email: string, username: string, password: string) => void;
  handleLogout: () => void;
};

export const UserContext = createContext<ContextType | null>(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const storeUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const clearUser = () => {
    console.info("clearUser");

    const userId = JSON.parse(localStorage.getItem("userId"));
    console.info("userId", userId);

    // Get user away from a page
    // if (Router.pathname.startsWith("/admin-page")) {
    //   Router.push("/login");
    // }

    // Reset localstorage
    localStorage.removeItem("userId");

    // Reset state
    setUser(null);
  };
  const userExists = () => {
    return !!user && user.username;
  };
  const handleLogin = async (email: string, password: string) => {
    await fauna({ type: "LOGIN_USER", email, password }).then(
      async (data: any) => {
        storeUser(data);
        localStorage.setItem("userId", JSON.stringify(data._id));
        // When logged in, push the user to a new page
        // Router.push("/admin-page");
      },
      (err) => {
        toastError(err);
        console.error("login err", err);
      }
    );
  };
  const handleSignup = async (
    email: string,
    username: string,
    password: string
  ) => {
    await fauna({ type: "CREATE_USER", email, username, password }).then(
      async (data: any) => {
        // const id = data.createUser._id;
        // send({ type: "SEND_CONFIRMATION_EMAIL", id, email });
        await handleLogin(email, password);
      },
      (err) => {
        toastError(err);
        console.error("signup err", err);
      }
    );
  };
  const handleLogout = async () => {
    clearUser();
    await fauna({ type: "LOGOUT_USER" });
  };
  useEffect(() => {
    if (!!user) {
      // User value is already read
      return;
    }
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId === null) {
      // There is no user data
      console.info("No user data");
      clearUser();
      return;
    }
    fauna({ type: "READ_USER", id: userId }).then(
      (data: any) => {
        // Check result
        if (!data.findUserByID) {
          console.error("Unauthenticated. Data:", data);
          toastError("Unauthenticated");
          clearUser();
          return;
        }

        // Store data
        storeUser(data.findUserByID);
      },
      (err) => {
        toastError(err);
        console.error("Failed getting the user data:", err);
        clearUser();
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        storeUser,
        clearUser,
        userExists,
        handleLogin,
        handleSignup,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

import { ToastContainer } from "react-toastify";
import type { AppProps /*, AppContext */ } from "next/app";

import "../styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

import UserContextProvider from "../contexts/userContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;

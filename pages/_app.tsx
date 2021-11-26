import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

import UserContextProvider from "../contexts/userContext";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="description" content="Game" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <UserContextProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </UserContextProvider>
    </div>
  );
}

export default MyApp;

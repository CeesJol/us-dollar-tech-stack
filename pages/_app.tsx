import { ToastContainer } from "react-toastify";
import type { AppProps /*, AppContext */ } from "next/app";

import "../styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <ToastContainer />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

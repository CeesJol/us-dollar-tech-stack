import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="description" content="Game" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <p>Hello world!</p>
    </div>
  );
}

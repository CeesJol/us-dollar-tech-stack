import Head from "next/head";
import Image from "next/image";
import { fauna } from "../lib/api/api";
import { toastError } from "../lib/error";
import { toast } from "react-toastify";
import Button from "../components/Button";

export default function Home() {
  return (
    <div>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="description" content="Game" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <p>Hello world!</p>
      <Button
        fn={async () => {
          await fauna({ type: "TEST_MUTATION", name: "test name" }).then(
            async (data) => {
              toast.success(
                "Created test data with name: " + data.createTest.name
              );
            },
            (err) => {
              toastError(err);
            }
          );
        }}
        text="Add test data"
        altText="Adding..."
      />
    </div>
  );
}

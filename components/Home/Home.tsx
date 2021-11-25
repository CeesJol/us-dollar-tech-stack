import React, { useEffect } from "react";
import Head from "next/head";
import Button from "@/components/Button";
import useHome from "./useHome";

const Home = () => {
  const { addTestData, addComment, testData, comments, init } = useHome();
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="description" content="Game" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div>{}</div>

      <h1>{process.env.APP_NAME}</h1>
      <h3>Database (FaunaDB)</h3>
      <Button fn={addTestData} text="Add test data" altText="Adding..." />
      <ul>
        {testData &&
          testData.map((item) => <li key={item._id}>{item.name}</li>)}
      </ul>

      <h3>Realtime comments (Ably)</h3>
      <Button fn={addComment} text="Add comment" altText="Adding..." />
      <ul>
        {comments &&
          comments.map((comment) => (
            <li key={comment.timestamp}>{comment.comment}</li>
          ))}
      </ul>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { fauna } from "../lib/api/api";
import { toastError } from "../lib/error";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Ably from "../components/ably";

export default function Home() {
  const [comments, setComments] = useState([]);
  const [testData, setTestData] = useState([]);
  useEffect(() => {
    // Load comments (Ably)
    const channel = Ably.channels.get("comments");
    channel.attach();
    channel.once("attached", () => {
      channel.history((err, page) => {
        // create a new array with comments in reverse order (old to new)
        const comments = Array.from(page.items, (item) => item.data);
        setComments(comments);
        channel.subscribe((msg) => {
          console.log(msg.data);
          setComments([...comments, msg.data]);
        });
      });
    });

    // Load test data (Fauna)
    fauna({ type: "TEST_QUERY" }).then(
      async (data) => {
        setTestData(data.testData.data);
      },
      (err) => {
        toastError(err);
      }
    );
  }, []);
  const addTestData = async () => {
    await fauna({ type: "TEST_MUTATION", name: "test name" }).then(
      async (data) => {
        toast.success("Created test data with name: " + data.createTest.name);
      },
      (err) => {
        toastError(err);
      }
    );
  };
  const addComment = () => {
    const comment = "Whats up?";
    const timestamp = Date.now();
    const commentObject = { comment, timestamp };
    const channel = Ably.channels.get("comments");
    channel.publish("add_comment", commentObject, (err) => {
      if (err) {
        console.log("Unable to publish message err = " + err.message);
      }
    });
  };
  return (
    <div>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="description" content="Game" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <h1>{process.env.APP_NAME}</h1>
      <h3>Database (FaunaDB)</h3>
      <Button fn={addTestData} text="Add test data" altText="Adding..." />
      <ul>
        {testData.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>

      <h3>Realtime comments (Ably)</h3>
      <Button
        fn={(e) => addComment(e)}
        text="Add comment"
        altText="Adding..."
      />
      <ul>
        {comments.map((comment) => (
          <li key={comment.timestamp}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  );
}

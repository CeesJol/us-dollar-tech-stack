import React, { useEffect, useState } from "react";
import { fauna } from "@/lib/api/api";
import { toastError } from "@/lib/error";
import { toast } from "react-toastify";
import Ably from "@/components/Ably";

/**
 * Custom React hook for the Home component.
 */
const useHome = () => {
  const [comments, setComments] = useState([]);
  const [testData, setTestData] = useState([]);

  /**
   * Add test data to the database (FaunaDB).
   */
  const addTestData = async () => {
    await fauna({ type: "TEST_MUTATION", name: "test name" }).then(
      async (data: any) => {
        toast.success("Created test data with name: " + data.createTest?.name);
      },
      (err) => {
        toastError(err);
      }
    );
  };

  /**
   * Send realtime data (Ably).
   */
  const addComment = () => {
    const comment = "My fav number is: " + Math.random();
    const timestamp = Date.now();
    const commentObject = { comment, timestamp };
    const channel = Ably.channels.get("comments");
    channel.publish("add_comment", commentObject, (err) => {
      if (err) {
        toastError(err.message);
      } else {
        toast.success("Added comment to top of the list!");
      }
    });
  };

  /**
   * What the component will do after rendering.
   */
  const init = () => {
    // Load comments (Ably)
    const channel = Ably.channels.get("comments");
    channel.attach();
    channel.once("attached", () => {
      channel.history((err, page) => {
        // create a new array with comments in reverse order (old to new)
        const comments = Array.from(page.items, (item) => item.data);
        setComments(comments);
        channel.subscribe((msg) => {
          setComments((oldArray) => [msg.data, ...oldArray]);
        });
      });
    });

    // Load test data (Fauna)
    fauna({ type: "TEST_QUERY" }).then(
      async (data: any) => {
        setTestData(data.testData?.data);
      },
      (err) => {
        toastError(err);
      }
    );
  };

  return { addTestData, addComment, testData, comments, init };
};

export default useHome;

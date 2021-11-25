import React, { useEffect, useContext, useState } from "react";
import Head from "next/head";
import Button from "@/components/Button";
import useHome from "./useHome";
import { UserContext } from "@/contexts/userContext";

const Home = () => {
  const { addTestData, addComment, testData, comments, init } = useHome();
  const { userExists, user, handleLogin, handleSignUp, handleLogOut } =
    useContext(UserContext);
  const [loginNotRegister, setLoginNotRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleChangeUsername = (event) => {
    setUsername(event.target.value.toLowerCase());
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
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

      <h1>{process.env.APP_NAME}</h1>

      <h3>Authentication</h3>
      {userExists() ? (
        <>
          <p>You are logged in as {user?.username}.</p>
          <Button fn={handleLogOut} text="Log out" />
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Button
            fn={() => setLoginNotRegister(!loginNotRegister)}
            text={`Let me ${loginNotRegister ? "register" : "log in"} instead`}
          />
          {loginNotRegister ? (
            <form>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={handleChangeEmail}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChangePassword}
              />

              <Button
                fn={() => handleLogin(email, password)}
                text="Log in"
                altText="Logging in..."
              />
            </form>
          ) : (
            <form>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={handleChangeEmail}
              />

              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChangeUsername}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChangePassword}
              />

              <Button
                fn={() => handleSignUp(email, username, password)}
                text="Sign up"
                altText="Signing up..."
              />
            </form>
          )}
        </>
      )}

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

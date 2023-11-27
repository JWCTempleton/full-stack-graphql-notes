import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error("ERROR", error);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      setUser(username);
      localStorage.setItem("note-user-token", token);
      localStorage.setItem("note-user", username);

      setUsername("");
      setPassword("");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      login({ variables: { username, password } });
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;

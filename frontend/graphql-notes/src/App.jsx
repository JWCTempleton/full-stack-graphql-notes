import "./App.css";
import { useApolloClient, useQuery } from "@apollo/client";
import Notes from "./components/Notes";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import Toggleable from "./components/Toggleable";
import { ALL_NOTES } from "./queries";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const result = useQuery(ALL_NOTES);
  const client = useApolloClient();

  useEffect(() => {
    let savedToken = localStorage.getItem("note-user-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} setUser={setUser} />
      </div>
    );
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {user && (
          <div>
            <h2>Welcome, {user}</h2> <button onClick={logout}>logout</button>
          </div>
        )}
      </div>
      <Toggleable buttonLabel="New Note">
        <NoteForm />
      </Toggleable>
      <h1>Notes</h1>
      <Notes notes={result.data.allNotes} user={user} />
    </>
  );
}

export default App;

import "./App.css";
import { useApolloClient, useQuery } from "@apollo/client";
import Notes from "./components/Notes";
import Home from "./components/Home";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import Toggleable from "./components/Toggleable";
import { ALL_NOTES } from "./queries";
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  // eslint-disable-next-line no-unused-vars
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
    setUser(null);
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
        <div>
          <Link style={{ padding: "10px" }} to="/">
            home
          </Link>
          <Link style={{ padding: "10px" }} to="/notes">
            notes
          </Link>
          <Link style={{ padding: "10px" }} to="/users">
            users
          </Link>
        </div>
        {user && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "18px",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            <h2>Welcome, {user}</h2> <button onClick={logout}>logout</button>
          </div>
        )}
      </div>
      {/* <Toggleable buttonLabel="New Note">
        <NoteForm />
      </Toggleable>
      <h1>Notes</h1>
      <Notes notes={result.data.allNotes} user={user} /> */}
      <Routes>
        <Route
          path="/notes"
          element={<Notes notes={result.data.allNotes} user={user} />}
        />
        {/* <Route path="/users" element={<Users />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

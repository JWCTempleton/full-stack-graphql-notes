import "./App.css";
import { useApolloClient, useQuery } from "@apollo/client";
import Notes from "./components/Notes";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import { ALL_NOTES, ME } from "./queries";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  const result = useQuery(ALL_NOTES);
  const client = useApolloClient();

  const user = useQuery(ME);

  user ? console.log("USER TEST", user.data) : console.log("NO USER");

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }
  return (
    <>
      <button onClick={logout}>logout</button>
      <NoteForm />
      <h1>Notes</h1>
      <Notes notes={result.data.allNotes} />
    </>
  );
}

export default App;

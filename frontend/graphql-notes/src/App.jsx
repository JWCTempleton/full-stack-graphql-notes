import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useApolloClient, useQuery } from "@apollo/client";
import Notes from "./components/Notes";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import UserNotes from "./components/UserNotes";
import Admin from "./components/Admin";
import { ALL_NOTES } from "./queries";
import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const result = useQuery(ALL_NOTES);
  const client = useApolloClient();

  // const { loading, error, data } = useQuery(ME, {
  //   fetchPolicy: "network-only", // Doesn't check cache before making a network request
  // });

  const navigate = useNavigate();

  useEffect(() => {
    let savedToken = localStorage.getItem("note-user-token");
    let savedUser = JSON.parse(localStorage.getItem("note-user"));
    if (savedToken) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (result.loading) {
    return <div>loading...</div>;
  }

  // error && console.log("NO USER LOGGED IN");

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    client.resetStore();
  };

  // if (!user) {
  //   return (
  //     <div>
  //       <h2>Login</h2>
  //       <LoginForm setToken={setToken} setUser={setUser} />
  //     </div>
  //   );
  // }

  // console.log("TEST ADMIN", logInResult.data);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <div
          style={{
            display: "flex",
            width: "80vw",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link style={{ padding: "10px" }} to="/">
              home
            </Link>
            <Link style={{ padding: "10px" }} to="/notes">
              all notes
            </Link>

            {token && (
              <Link style={{ padding: "10px" }} to="/usernotes">
                my notes
              </Link>
            )}
            {token && user.is_admin && (
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
                to="/admin"
              >
                admin
              </Link>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "12px",
            }}
          >
            {token ? (
              <>
                <h2>Welcome, {user.username}</h2>{" "}
                <button onClick={logout}>logout</button>
              </>
            ) : (
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
                to="/login"
              >
                login
              </Link>
            )}
          </div>
        </div>

        {/* <Toggleable buttonLabel="New Note">
        <NoteForm />
      </Toggleable>
      <h1>Notes</h1>
      <Notes notes={result.data.allNotes} user={user} /> */}
        <Routes>
          <Route
            path="/notes"
            element={
              <Notes
                notes={result.data.allNotes}
                user={user}
                visible={visible}
                setVisible={setVisible}
              />
            }
          />
          <Route
            path="/usernotes"
            element={
              <UserNotes
                user={user}
                visible={visible}
                setVisible={setVisible}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginForm setToken={setToken} setUser={setUser} />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

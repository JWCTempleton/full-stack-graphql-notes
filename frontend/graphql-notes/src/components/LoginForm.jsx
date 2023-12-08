import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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

  console.log("TEST", result.data);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      setUser(result.data.login.user);
      localStorage.setItem("note-user-token", token);
      localStorage.setItem("note-user", JSON.stringify(result.data.login.user));

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
    // <div>
    //   <form onSubmit={handleLogin}>
    //     <div>
    //       username{" "}
    //       <input
    //         value={username}
    //         onChange={({ target }) => setUsername(target.value)}
    //       />
    //     </div>
    //     <div>
    //       password{" "}
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={({ target }) => setPassword(target.value)}
    //       />
    //     </div>
    //     <button type="submit">login</button>
    //   </form>
    // </div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{
            mt: 1,
            mb: 4,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            sx={{ backgroundColor: "#121212" }}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={({ target }) => setPassword(target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              justifySelf: "center",
            }}
          >
            Sign In
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            {/* <Link href="#" variant="body2">
              Forgot password?
            </Link> */}
            <Link href="/signup" variant="body2">
              {"Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;

import { useState, useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Alert, // Import Alert from Mantine
} from "@mantine/core";
import classes from "../styles/AuthenticationTitle.module.css";
const API_URL = import.meta.env.VITE_API_URL;

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { storeToken, authenticateUser, setIsTeacher } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const responseData = await response.json();
        storeToken(responseData.token);
        console.log(responseData);
        setIsTeacher(responseData.isTeacher);
        authenticateUser();
        navigate("/main");
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  return (
    <>
      <div className={classes.signInBackground} />
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title ta="center" className={classes.title}>
            Welcome back!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Don't have an account yet?{" "}
            <Anchor size="sm" component={Link} to="/signup">
              Create account
            </Anchor>
          </Text>
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <Alert color="red" mt="sm">
                {errorMessage}
              </Alert>
            )}
            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
            />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <NavLink to="/forgotpassword">Forgot password?</NavLink>
            </Group>
            <Button type="submit" fullWidth mt="xl">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default SignIn;

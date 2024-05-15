import axios from "axios";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Checkbox,
  Paper,
  Container,
  Title,
  getFontSize,
} from "@mantine/core";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "../styles/AuthenticationTitle.module.css";
const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  // const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePhone = (e) => setPhoneNumber(e.target.value);
  const handleTeacher = (e) => setIsTeacher(e.currentTarget.checked);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      isTeacher,
    };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <>
      <div className={classes.signInBackground}></div>
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title ta="center" fw={600} p={10}>
            Create an Account
          </Title>
          <form onSubmit={handleSignupSubmit}>
            <Stack>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                value={firstName}
                onChange={handleFirstName}
                radius="md"
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                value={lastName}
                onChange={handleLastName}
                radius="md"
              />
              <TextInput
                required
                label="Phone"
                placeholder="07039434"
                value={phoneNumber}
                onChange={handlePhone}
                radius="md"
              />

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={email}
                onChange={handleEmail}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={handlePassword}
                radius="md"
              />

              <Checkbox
                label="Are you a teacher?"
                checked={isTeacher}
                onChange={handleTeacher}
              />
              {errorMessage && (
                <Text color="red" size="sm">
                  {errorMessage}
                </Text>
              )}
              <Button type="submit">Create Account</Button>
            </Stack>
          </form>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor size="sm" component={Link} to="/signin">
              Sign In
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </>
  );
};

export default SignUp;

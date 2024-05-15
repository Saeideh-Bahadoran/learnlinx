import React, { useState } from "react";
import { Button, Input, Container, Paper, Title } from "@mantine/core";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to send email
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message); // You might want to handle this more gracefully
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title ta="center" fw={600} p={10}>
            Forgot Your Password?
          </Title>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <Button type="submit">Send Reset Link</Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default ForgotPassword;

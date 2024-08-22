import type { ReactNode } from "react";

import { useState } from "react";
import { Button, TextInput } from "react95";
import styled from "styled-components";

import { buyLicense } from "~/lib/buy-license";
import { Window } from "~/lib/window";

const StyledWindow = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Description = styled.p`
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

function validateEmail(email: string): boolean {
  const re = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
  return re.test(email);
}

export function PCommunity(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");

  function handleJoinNow(): void {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(undefined);
    buyLicense(email)
      .catch((error: unknown) => {
        setError("An error occurred. Please try again.");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <StyledWindow window="P Community" defaultWidth={400} defaultHeight={300}>
      <Title>Join P Community</Title>
      <Description>
        Connect with other developers, share your projects, and get help from
        the community.
      </Description>
      <TextInput
        value={email}
        onChange={(value) => {
          setEmail(value.target.value);
        }}
        placeholder="Enter your email"
        fullWidth
        style={{ marginBottom: "10px" }}
      />
      <Button
        onClick={handleJoinNow}
        disabled={isLoading || !validateEmail(email)}
      >
        {isLoading ? "Loading..." : "Join Now"}
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledWindow>
  );
}

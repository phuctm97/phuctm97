import type { ReactNode } from "react";

import { useState } from "react";
import { Button } from "react95";
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

export function PCommunity(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  function handleJoinNow(): void {
    setIsLoading(true);
    setError(undefined);
    buyLicense()
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
      <Button onClick={handleJoinNow} disabled={isLoading}>
        {isLoading ? "Loading..." : "Join Now"}
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledWindow>
  );
}

import type { ReactNode } from "react";

import { useState } from "react";
import { Anchor, Button, Hourglass } from "react95";
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

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
`;

const LanguageSwitch = styled(Button)`
  font-size: 0.8rem;
  padding: 4px 8px;
`;

const Description = styled.p`
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const content = {
  vi: {
    title: "Tham gia P Community",
    description:
      "Kết nối với các lập trình viên Việt Nam khác, chia sẻ kiến thức, kinh nghiệm, trải nghiệm của bạn, nhận sự giúp đỡ từ {{author}}, và những người khác trong cộng đồng.",
    note: "Lưu ý rằng cộng đồng của chúng tôi chủ yếu giao tiếp bằng tiếng Việt. Chúng tôi khuyên bạn chỉ nên tham gia nếu bạn nói được tiếng Việt.",
    joinButton: "Tham gia ngay",
    emailPlaceholder: "Nhập email của bạn (có thể để trống)",
    emailError: "Email không hợp lệ",
  },
  en: {
    title: "Join P Community",
    description:
      "Connect with other Vietnamese developers, share your challenges, get help from {{author}}, and others in the community.",
    note: "Please note that our community primarily communicates in Vietnamese. We recommend joining only if you speak Vietnamese.",
    joinButton: "Join Now",
    emailPlaceholder: "Enter your email (optional)",
    emailError: "Invalid email",
  },
};

export function Community(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("en");
  const [error, setError] = useState("");
  const data = content[language];

  const handleJoinNow = (): void => {
    setIsLoading(true);
    buyLicense().catch((error: unknown) => {
      setError("An error occurred. Please try again.");
      console.error(error);
      setIsLoading(false);
    });
  };

  const toggleLanguage = (): void => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const renderDescription = (description: string): ReactNode => {
    const parts = description.split("{{author}}");
    return (
      <>
        {parts[0]}
        <Anchor
          css="display: inline-block;"
          href="https://x.com/phuctm97"
          target="_blank"
          rel="noopener noreferrer"
        >
          Minh-Phuc Tran
        </Anchor>
        {parts[1]}
      </>
    );
  };

  return (
    <StyledWindow window="Community" defaultWidth={450} defaultHeight={450}>
      <TitleContainer>
        <div style={{ width: "35px" }} />
        <Title>{data.title}</Title>
        <LanguageSwitch onClick={toggleLanguage}>
          {language === "vi" ? "VI" : "EN"}
        </LanguageSwitch>
      </TitleContainer>
      <Description>{renderDescription(data.description)}</Description>
      <Description>{data.note}</Description>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading ? (
        <Hourglass size={24} css="margin-top: 5px; margin-bottom: 5px;" />
      ) : (
        <Button
          css="flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 5px; margin-bottom: 5px;"
          onClick={handleJoinNow}
        >
          {data.joinButton}
        </Button>
      )}
    </StyledWindow>
  );
}

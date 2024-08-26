import type { ReactNode } from "react";
import type { SelectOption } from "react95/dist/Select/Select.types";

import { useState } from "react";
import { Anchor, Button, Hourglass, Select } from "react95";
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

const LanguageSelect = styled(Select)`
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

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
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

  const handleLanguageChange = (selectedOption: SelectOption<string>): void => {
    setLanguage(selectedOption.value as "vi" | "en");
  };

  const renderDescription = (description: string): ReactNode => {
    const parts = description.split("{{author}}");
    return (
      <>
        {parts[0]}
        <Anchor
          css="display: inline-block;"
          href={
            language === "vi"
              ? "https://www.facebook.com/phuctm97"
              : "https://x.com/phuctm97"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {language === "vi" ? "Trần Minh Phúc" : "Minh-Phuc Tran"}
        </Anchor>
        {parts[1]}
      </>
    );
  };

  return (
    <StyledWindow window="Community" defaultWidth={450} defaultHeight={400}>
      <TitleContainer>
        <div style={{ width: "90px" }} />
        <Title>{data.title}</Title>
        <LanguageSelect
          options={[
            { value: "en", label: "EN" },
            { value: "vi", label: "VI" },
          ]}
          value={language}
          onChange={(selectedOption) => {
            handleLanguageChange(selectedOption as SelectOption<string>);
          }}
        />
      </TitleContainer>
      <Description>{renderDescription(data.description)}</Description>
      <Description>{data.note}</Description>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Footer>
        {isLoading ? (
          <Hourglass size={24} />
        ) : (
          <Button onClick={handleJoinNow}>{data.joinButton}</Button>
        )}
      </Footer>
    </StyledWindow>
  );
}

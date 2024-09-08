import type { ReactNode } from "react";

import type { CommonProps, Language } from "./types";

import { User, User2, User3, Wab321019 } from "@react95/icons";
import { useEffect, useState } from "react";
import { Button, MenuList, MenuListItem, Separator } from "react95";
import styled from "styled-components";

import { useNullableState } from "~/lib/use-nullable-state";
import { Window } from "~/lib/window";

import communityImage from "./community.webp";
import { Payment } from "./payment";
import { content } from "./types";

const StyledWindow = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  align-items: stretch;
  justify-content: space-between;
  flex: 1;
`;

const ImageContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: ${({ isMobile }) => (isMobile ? "center" : "flex-start")};
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "flex-start")};
  flex: 0 0 auto;
  max-width: ${({ isMobile }) => (isMobile ? "100%" : "50%")};
  height: ${({ isMobile }) => (isMobile ? "auto" : "100%")};
  margin-bottom: ${({ isMobile }) => (isMobile ? "20px" : "0")};
`;

interface CommunityImageProps {
  maxWidth: number;
  maxHeight: number;
  isMobile: boolean;
}

const CommunityImage = styled.img<CommunityImageProps>`
  width: auto;
  height: auto;
  object-fit: contain;
  max-width: 100%;
  max-height: ${(props: CommunityImageProps) =>
    props.isMobile ? "auto" : `${props.maxHeight.toString()}px`};
  object-position: ${(props: CommunityImageProps) =>
    props.isMobile ? "center" : "left top"};
  border: 2px solid black;
`;

const ContentContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: ${({ isMobile }) => (isMobile ? "0" : "20px")};
  min-width: 0;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-weight: bold;
  text-align: center;
  font-size: 24px;
`;

const Description = styled.p`
  margin-bottom: 20px;
  line-height: 1.6;
`;

const BulletPoint = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const BulletIcon = styled.span`
  margin-right: 10px;
`;

const BulletContent = styled.span`
  flex: 1;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
`;

const StyledDivider = styled(Separator)`
  margin: 20px;
`;

const LanguageSelect = styled(MenuList)`
  font-size: 0.8rem;
  padding: 0px 8px;
`;

const StyledMenuListItem = styled(MenuListItem)`
  margin: 4px;
`;

export function Community(): ReactNode {
  const [language, setLanguage] = useState<Language>("en");
  const [error, setError] = useState<string>("");
  const [currentView, setCurrentView] = useState<"main" | "payment">("main");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const data = content[language];
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 1200, height: 750 });
  const [element, ref] = useNullableState<HTMLDivElement>();

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(windowSize.width <= 600);
    };

    checkMobile();
    addEventListener("resize", checkMobile);

    return () => {
      removeEventListener("resize", checkMobile);
    };
  }, [windowSize]);

  useEffect(() => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWindowSize({ width, height });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element]);

  const handleToggleView = (): void => {
    setCurrentView(currentView === "main" ? "payment" : "main");
  };

  const handleLanguageChange = (value: Language): void => {
    setLanguage(value);
  };

  const renderDescription = (description: string): ReactNode =>
    description.replace(
      "{{author}}",
      language === "vi" ? "Trần Minh Phúc" : "Minh-Phuc Tran",
    );

  const renderBulletPoint = (icon: ReactNode, content: string): ReactNode => (
    <BulletPoint>
      <BulletIcon>{icon}</BulletIcon>
      <BulletContent>{renderDescription(content)}</BulletContent>
    </BulletPoint>
  );

  const commonProps: CommonProps = {
    language,
    data,
    setError,
    error,
  };
  return (
    <StyledWindow
      window="Community"
      defaultWidth={1200}
      defaultHeight={750}
      ref={ref}
    >
      <ContentWrapper isMobile={isMobile}>
        <ImageContainer isMobile={isMobile}>
          <CommunityImage
            src={communityImage.src}
            alt="Community"
            maxWidth={
              isMobile ? windowSize.width * 0.45 : windowSize.width * 0.5
            }
            maxHeight={
              isMobile ? windowSize.height * 0.3 : windowSize.height * 0.75
            }
            isMobile={isMobile}
          />
        </ImageContainer>
        <ContentContainer isMobile={isMobile}>
          {currentView === "main" ? (
            <>
              <TitleContainer>
                <Title>{data.title}</Title>
              </TitleContainer>
              <Description>{renderDescription(data.description)}</Description>
              {renderBulletPoint(<Wab321019 />, data.communityDetails)}
              {renderBulletPoint(<User />, data.ownerIntroduction)}
              {renderBulletPoint(<User3 />, data.knowledgeSharing)}
              {renderBulletPoint(<User2 />, data.note)}
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          ) : (
            <Payment {...commonProps} />
          )}
        </ContentContainer>
      </ContentWrapper>
      <StyledDivider />
      <Footer>
        <Button onClick={handleToggleView}>
          {currentView === "main" ? data.joinButton : data.backButton}
        </Button>
        <StyledDivider orientation="vertical" />
        <LanguageSelect inline>
          <StyledMenuListItem
            square
            size="sm"
            onClick={() => {
              handleLanguageChange("en");
            }}
            primary={language === "en"}
          >
            <span style={{ fontSize: "12px" }}>EN</span>
          </StyledMenuListItem>
          <StyledMenuListItem
            square
            size="sm"
            onClick={() => {
              handleLanguageChange("vi");
            }}
            primary={language === "vi"}
          >
            <span style={{ fontSize: "12px" }}>VI</span>
          </StyledMenuListItem>
        </LanguageSelect>
      </Footer>
    </StyledWindow>
  );
}

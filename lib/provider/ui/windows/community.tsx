import type { ReactNode } from "react";
import type { SelectOption } from "react95/dist/Select/Select.types";

import { customAlphabet } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { Anchor, Button, Hourglass, Select } from "react95";
import { createScrollbars } from "react95/dist/common";
import styled from "styled-components";

import { addLicenseToKVRedirectTelegram } from "~/lib/add-license-kv-redirect-telegram";
import { buyLicense } from "~/lib/buy-license";
import { checkSEPayTransactionSuccess } from "~/lib/check-sepay-transaction-success";
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #c6c6c6;
  padding: 20px;
  border: 2px solid;
  box-shadow: 2px 2px 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const QRCodeImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const QRCodeDescription = styled.p`
  margin-bottom: 15px;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  ${createScrollbars()}
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
    backButton: "Quay lại",
    paymentOptions: "Tùy chọn thanh toán",
    sepayNote:
      "Hãy quét mã QR để thanh toán. Lưu ý: Xin vui lòng không tắt trình duyệt trong khi thanh toán.",
    timeRemaining: "Thời gian còn lại để thanh toán:",
    seconds: "giây",
    cancelPayment: "Hủy thanh toán",
  },
  en: {
    title: "Join P Community",
    description:
      "Connect with other Vietnamese developers, share your challenges, get help from {{author}}, and others in the community.",
    note: "Please note that our community primarily communicates in Vietnamese. We recommend joining only if you speak Vietnamese.",
    joinButton: "Join Now",
    emailPlaceholder: "Enter your email (optional)",
    emailError: "Invalid email",
    backButton: "Back",
    paymentOptions: "Payment Options",
    sepayNote:
      "Please scan the QR code to make a payment. Note: Please do not turn off your browser while making a payment.",
    timeRemaining: "Time remaining to pay:",
    seconds: "seconds",
    cancelPayment: "Cancel payment",
  },
};

export function Community(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("en");
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState<"main" | "payment">("main");
  const [showQRCode, setShowQRCode] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isCheckingTransaction, setIsCheckingTransaction] = useState(false);
  const [qrCodeExpirationTime, setQrCodeExpirationTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const data = content[language];

  const handleJoinNow = (): void => {
    setCurrentView("payment");
  };

  const handleVNPay = (): void => {
    const nanoid = customAlphabet(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      10,
    );
    const newTransactionId = nanoid();
    setTransactionId(newTransactionId);
    setShowQRCode(true);
    setQrCodeExpirationTime(Date.now() + 5 * 60 * 1000);
    setIsCheckingTransaction(true);
  };

  const handleInternationalCard = (): void => {
    setIsLoading(true);
    buyLicense()
      .catch((error: unknown) => {
        setError("An error occurred. Please try again.");
        console.error(error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBack = (): void => {
    setCurrentView("main");
    setShowQRCode(false);
    setIsCheckingTransaction(false);
  };

  const handleLanguageChange = (selectedOption: SelectOption<string>): void => {
    setLanguage(selectedOption.value as "vi" | "en");
  };

  const checkSEPayTransaction = useCallback(async () => {
    if (!transactionId) return;

    const success = await checkSEPayTransactionSuccess(transactionId);
    if (success) {
      setIsCheckingTransaction(false);
      setShowQRCode(false);
      setError("");
      setIsLoading(true);
      void addLicenseToKVRedirectTelegram(transactionId).finally(() => {
        setIsLoading(false);
      });
    }
  }, [transactionId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isCheckingTransaction) {
      intervalId = setInterval(() => {
        void checkSEPayTransaction();
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCheckingTransaction, checkSEPayTransaction]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showQRCode) {
      intervalId = setInterval(() => {
        const timeLeft = Math.max(
          0,
          Math.floor((qrCodeExpirationTime - Date.now()) / 1000),
        );
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          setShowQRCode(false);
          setIsCheckingTransaction(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [showQRCode, qrCodeExpirationTime]);

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

  const renderMainView = (): ReactNode => (
    <>
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
      <ScrollableContent>
        <Description>{renderDescription(data.description)}</Description>
        <Description>{data.note}</Description>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ScrollableContent>
      <Footer>
        <Button onClick={handleJoinNow}>{data.joinButton}</Button>
      </Footer>
    </>
  );

  const renderPaymentView = (): ReactNode => (
    <>
      <Title>{data.paymentOptions}</Title>
      <ScrollableContent>
        <ButtonContainer>
          <Button disabled={isLoading} onClick={handleVNPay}>
            QR Code / Bank Transfer
          </Button>
          <Button disabled={isLoading} onClick={handleInternationalCard}>
            Visa / Mastercard / PayPal
          </Button>
          <Button disabled={isLoading} onClick={handleBack}>
            {data.backButton}
          </Button>
          {isLoading && <Hourglass size={24} />}
        </ButtonContainer>
      </ScrollableContent>
      {showQRCode && (
        <ModalOverlay>
          <ModalContent>
            <QRCodeImage
              src={`https://qr.sepay.vn/img?bank=${process.env.NEXT_PUBLIC_SEPAY_BANK_NAME ?? ""}&acc=${process.env.NEXT_PUBLIC_SEPAY_BANK_ACCOUNT_NUMBER ?? ""}&template=compact&amount=2490000&des=${transactionId}`}
              alt="VNPay QR Code"
            />
            <QRCodeDescription>
              {data.timeRemaining} <strong>{remainingTime}</strong>{" "}
              {data.seconds}
              <br />
              {data.sepayNote}
            </QRCodeDescription>
            <Button
              onClick={() => {
                setShowQRCode(false);
                setIsCheckingTransaction(false);
              }}
            >
              {data.cancelPayment}
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );

  return (
    <StyledWindow window="Community" defaultWidth={450} defaultHeight={400}>
      {currentView === "main" ? renderMainView() : renderPaymentView()}
    </StyledWindow>
  );
}

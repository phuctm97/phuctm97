import type { ReactNode } from "react";

import type { CommonProps } from "./types";

import { customAlphabet } from "nanoid";
import { numbers } from "nanoid-dictionary";
import { useCallback, useEffect, useState } from "react";
import { Button, Hourglass, Tab, TabBody, Tabs } from "react95";
import styled from "styled-components";

import { buyLicense } from "~/lib/buy-license";
import { checkSEPayTransactionSuccess } from "~/lib/check-sepay-transaction-success";

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const QRCodeImage = styled.img`
  max-width: 100%;
  height: 60%;
  margin-bottom: 10px;
`;

const QRCodeDescription = styled.p`
  margin-bottom: 15px;
  text-align: center;
`;

const StyledTabs = styled(Tabs)`
  margin-top: 5px;
  width: 100%;
`;

const StyledTab = styled(Tab)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;

const StyledTabBody = styled(TabBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

export function Payment({ data, setError }: CommonProps): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [isCheckingTransaction, setIsCheckingTransaction] =
    useState<boolean>(false);
  const [qrCodeExpirationTime, setQrCodeExpirationTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleVNPay = (): void => {
    const code = customAlphabet(numbers, 10);
    setCode(code());
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

  const checkSEPayTransaction = useCallback(async () => {
    if (!code) return;

    const success = await checkSEPayTransactionSuccess(code);
    if (success) {
      setIsCheckingTransaction(false);
      setShowQRCode(false);
      setError("");
      location.href = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY_BOT_ID}?start=TMP${code}`;
    }
  }, [code, setError]);

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

  return (
    <ContentWrapper>
      <TitleContainer>
        <Title>{data.paymentOptions}</Title>
      </TitleContainer>
      <StyledTabs value={activeTab} onChange={setActiveTab}>
        <StyledTab value={0}>Visa / Mastercard / PayPal</StyledTab>
        <StyledTab value={1}>QR Code / Bank Transfer</StyledTab>
      </StyledTabs>

      {activeTab === 0 && (
        <StyledTabBody>
          <Button disabled={isLoading} onClick={handleInternationalCard}>
            {data.proceedToPayment} {isLoading && <Hourglass size={24} />}
          </Button>
        </StyledTabBody>
      )}
      {activeTab === 1 && (
        <StyledTabBody>
          {showQRCode ? (
            <>
              <QRCodeImage
                src={`https://qr.sepay.vn/img?bank=${process.env.NEXT_PUBLIC_SEPAY_BANK_NAME}&acc=${process.env.NEXT_PUBLIC_SEPAY_BANK_ACCOUNT_NUMBER}&template=qronly&amount=${process.env.NEXT_PUBLIC_SEPAY_AMOUNT}&des=TMP${code}`}
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
            </>
          ) : (
            <Button disabled={isLoading} onClick={handleVNPay}>
              {data.generateQRCode}
            </Button>
          )}
        </StyledTabBody>
      )}
    </ContentWrapper>
  );
}

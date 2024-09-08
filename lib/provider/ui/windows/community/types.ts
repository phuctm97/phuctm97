export type Language = "vi" | "en";

export interface ContentType {
  title: string;
  description: string;
  note: string;
  joinButton: string;
  emailPlaceholder: string;
  emailError: string;
  backButton: string;
  paymentOptions: string;
  sepayNote: string;
  timeRemaining: string;
  seconds: string;
  cancelPayment: string;
  communityDetails: string;
  ownerIntroduction: string;
  knowledgeSharing: string;
  generateQRCode: string;
  proceedToPayment: string;
}

export interface Content {
  vi: ContentType;
  en: ContentType;
}

export const content: Content = {
  vi: {
    title: "P Community cho người Việt Nam",
    description:
      "Chào mừng bạn đến với P Community - nơi kết nối các lập trình viên Việt Nam. Đây là nơi bạn có thể chia sẻ kinh nghiệm, học hỏi và phát triển cùng nhau.",
    communityDetails:
      "Trong cộng đồng của chúng tôi, bạn sẽ gặp gỡ các developer với nhiều stack công nghệ khác nhau, từ front-end đến back-end, mobile, và nhiều lĩnh vực khác. Đây là cơ hội tuyệt vời để mở rộng kiến thức và network của bạn.",
    ownerIntroduction:
      "{{author}}, người sáng lập của P Community, luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn. Với kinh nghiệm phong phú trong ngành, anh ấy sẽ là nguồn cảm hứng và hướng dẫn quý giá cho sự phát triển của bạn.",
    knowledgeSharing:
      "Đừng ngần ngại chia sẻ kiến thức và kinh nghiệm của bạn trong cộng đồng. Mỗi đóng góp đều có giá trị và giúp xây dựng một môi trường học tập tích cực cho tất cả mọi người.",
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
    generateQRCode: "Tạo mã QR",
    proceedToPayment: "Tiến hành thanh toán",
  },
  en: {
    title: "P Community for Vietnamese Developers",
    description:
      "Welcome to P Community - a place to connect Vietnamese developers. This is where you can share experiences, learn, and grow together.",
    communityDetails:
      "In our community, you'll meet developers with various technology stacks, from front-end to back-end, mobile, and many other fields. This is a great opportunity to expand your knowledge and network.",
    ownerIntroduction:
      "{{author}}, the founder of P Community, is always ready to support and answer your questions. With extensive industry experience, he will be a valuable source of inspiration and guidance for your development.",
    knowledgeSharing:
      "Don't hesitate to share your knowledge and experience within the community. Every contribution is valuable and helps build a positive learning environment for everyone.",
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
    generateQRCode: "Generate QR Code",
    proceedToPayment: "Proceed to Payment",
  },
};

export interface CommonProps {
  language: Language;
  data: ContentType;
  setError: (error: string) => void;
  error: string;
}

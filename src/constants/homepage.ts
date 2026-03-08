import type { Icon } from "@phosphor-icons/react";
import {
  BookOpen,
  Brain,
  Globe,
  PencilLine,
  UserPlus,
  FolderPlus,
  ArrowsClockwise,
} from "@phosphor-icons/react";

// ─── Types ──────────────────────────────────────────────────

export interface Feature {
  icon: Icon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export interface Step {
  icon: Icon;
  step: string;
  title: string;
  description: string;
}

export interface FooterContact {
  author: string;
  phone: string;
  email: string;
}

// ─── Data ───────────────────────────────────────────────────

export const APP_NAME = "LearningApp";

export const HERO_CONTENT = {
  badge: "Miễn phí hoàn toàn",
  title: "Học ngôn ngữ",
  titleHighlight: "hiệu quả",
  titleSuffix: "với Flashcard thông minh",
  description:
    "Tạo bộ thẻ từ vựng và ngữ pháp cho bất kỳ ngôn ngữ nào. Ôn tập thông minh, ghi nhớ lâu hơn.",
  ctaPrimary: "Bắt đầu miễn phí",
  ctaSecondary: "Tìm hiểu thêm",
};

export const FEATURES_CONTENT = {
  title: "Tính năng",
  titleHighlight: "nổi bật",
  description: "Mọi thứ bạn cần để học ngôn ngữ một cách hiệu quả",
};

export const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: "Tạo bộ thẻ linh hoạt",
    description:
      "Tổ chức từ vựng và ngữ pháp thành các bộ thẻ riêng biệt, dễ quản lý.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    icon: Brain,
    title: "Ghi nhớ thông minh",
    description:
      "Hệ thống flashcard giúp bạn ôn tập đúng lúc, ghi nhớ lâu hơn.",
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-600",
  },
  {
    icon: Globe,
    title: "Đa ngôn ngữ",
    description:
      "Hỗ trợ mọi ngôn ngữ — tiếng Anh, Nhật, Hàn, Pháp, và nhiều hơn nữa.",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon: PencilLine,
    title: "Câu ví dụ tương tác",
    description:
      "Luyện tập với bài tập điền vào chỗ trống, hiểu ngữ cảnh thực tế.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export const STEPS_CONTENT = {
  title: "Bắt đầu",
  titleHighlight: "dễ dàng",
  description: "Chỉ 3 bước đơn giản để bắt đầu hành trình của bạn",
};

export const STEPS: Step[] = [
  {
    icon: UserPlus,
    step: "01",
    title: "Tạo tài khoản",
    description: "Đăng ký miễn phí chỉ trong vài giây",
  },
  {
    icon: FolderPlus,
    step: "02",
    title: "Tạo bộ thẻ",
    description: "Thêm từ vựng, ngữ pháp và câu ví dụ",
  },
  {
    icon: ArrowsClockwise,
    step: "03",
    title: "Học & ôn tập",
    description: "Ôn tập mỗi ngày với flashcard thông minh",
  },
];

export const CTA_CONTENT = {
  title: "Sẵn sàng bắt đầu học?",
  description:
    "Tham gia ngay hôm nay — hoàn toàn miễn phí, không cần thẻ tín dụng.",
  ctaPrimary: "Đăng ký miễn phí",
  ctaSecondary: "Đăng nhập",
};

/**
 * Thông tin liên hệ hiển thị ở footer.
 * TODO: Điền thông tin thực tế vào đây.
 */
export const FOOTER_CONTACT: FooterContact = {
  author: "Thái Trường",
  phone: "0374963082",
  email: "truongg9655@gmail.com",
};

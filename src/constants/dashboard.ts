import type { Icon } from "@phosphor-icons/react";
import {
  Stack,
  Cards,
  CheckCircle,
  Flame,
  BookOpen,
  ArrowsClockwise,
} from "@phosphor-icons/react";

// ─── Types ──────────────────────────────────────────────────

export interface StatCard {
  icon: Icon;
  label: string;
  value: string;
  change: string;
  iconBg: string;
  iconColor: string;
}

export interface QuickAction {
  icon: Icon;
  title: string;
  description: string;
  to: string;
  variant: "primary" | "accent";
}

// ─── Data ───────────────────────────────────────────────────

export const DASHBOARD_GREETING = {
  title: "Chào mừng trở lại!",
  subtitle: "Tiếp tục hành trình học tập của bạn ngay hôm nay.",
};

export const STAT_CARDS: StatCard[] = [
  {
    icon: Stack,
    label: "Bộ thẻ",
    value: "12",
    change: "+2 tuần này",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Cards,
    label: "Thẻ từ",
    value: "348",
    change: "+24 tuần này",
    iconBg: "bg-accent/40",
    iconColor: "text-accent-foreground",
  },
  {
    icon: CheckCircle,
    label: "Đã ôn tập",
    value: "156",
    change: "hôm nay: 12",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    icon: Flame,
    label: "Chuỗi ngày",
    value: "7",
    change: "kỷ lục: 14",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: BookOpen,
    title: "Nội dung học",
    description: "Khám phá và học từ vựng mới từ các bộ thẻ của bạn.",
    to: "/dashboard/decks",
    variant: "primary",
  },
  {
    icon: ArrowsClockwise,
    title: "Ôn Luyện",
    description: "Ôn tập các thẻ đã đến hạn để củng cố trí nhớ.",
    to: "/dashboard/review",
    variant: "accent",
  },
];

export const ACTIVITY_SECTION = {
  title: "Hoạt động gần đây",
  emptyMessage: "Chưa có hoạt động nào. Bắt đầu học ngay!",
};

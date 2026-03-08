import { EnvelopeSimple, Phone, User, BookOpen, Brain, Sparkle } from "@phosphor-icons/react";
import { AppLogo } from "@/components/illustrations/AppLogo";
import { Separator } from "@/components/ui/separator";
import { APP_NAME, FOOTER_CONTACT } from "@/constants/homepage";

const FOOTER_FEATURES = [
  { icon: BookOpen, label: "Bộ thẻ từ vựng" },
  { icon: Brain, label: "Ôn tập thông minh" },
  { icon: Sparkle, label: "Flashcard tương tác" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo className="h-9 w-9 rounded-lg" />
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Nền tảng học ngôn ngữ với flashcard thông minh — tạo bộ thẻ, ôn tập hiệu quả, ghi nhớ lâu hơn.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tính năng
            </h4>
            <ul className="space-y-3">
              {FOOTER_FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Icon className="h-4 w-4 text-primary/60 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-primary/60 shrink-0" />
                <span>{FOOTER_CONTACT.author}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary/60 shrink-0" />
                <span>{FOOTER_CONTACT.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <EnvelopeSimple className="h-4 w-4 text-primary/60 shrink-0" />
                <span>{FOOTER_CONTACT.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800/60" />

        {/* Bottom bar */}
        <div className="py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

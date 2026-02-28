import { GraduationCap, EnvelopeSimple as Mail, Phone, User, BookOpenText as BookOpen, Brain, Sparkle as Sparkles } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { APP_NAME, FOOTER_CONTACT } from "@/constants/homepage";

const FOOTER_FEATURES = [
  { icon: BookOpen, label: "Bộ thẻ từ vựng" },
  { icon: Brain, label: "Ôn tập thông minh" },
  { icon: Sparkles, label: "Flashcard tương tác" },
];

export function Footer() {
  return (
    <footer className="bg-muted/40 text-muted-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold text-foreground">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Nền tảng học ngôn ngữ với flashcard thông minh — tạo bộ thẻ, ôn tập hiệu quả, ghi nhớ lâu hơn.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Tính năng
            </h4>
            <ul className="space-y-3">
              {FOOTER_FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary/60 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
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
                <Mail className="h-4 w-4 text-primary/60 shrink-0" />
                <span>{FOOTER_CONTACT.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Bottom bar */}
        <div className="py-6 text-center text-sm text-muted-foreground/70">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


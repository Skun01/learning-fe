import { useNavigate } from "react-router";
import { GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudyIllustration } from "@/components/illustrations/StudyIllustration";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full">
      {/* Left — Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/4 right-0 h-40 w-40 rounded-full bg-teal-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center max-w-md text-center">
          <StudyIllustration className="w-full max-w-sm mb-8 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Học ngôn ngữ mỗi ngày
          </h2>
          <p className="text-violet-100 text-lg leading-relaxed">
            Flashcard thông minh giúp bạn ghi nhớ từ vựng và ngữ pháp hiệu quả hơn
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gradient-to-br from-violet-50/50 to-teal-50/30 p-6 sm:p-8">
        <Card className="w-full max-w-md border-0 bg-white/80 shadow-xl shadow-violet-200/30 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-2">
            {/* Logo */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-300/50">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Chào mừng trở lại
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-500">
                Đăng nhập để tiếp tục học tập
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <LoginForm onSuccess={() => navigate("/dashboard")} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
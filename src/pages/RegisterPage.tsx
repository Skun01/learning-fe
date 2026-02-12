import { GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { StudyIllustration } from "@/components/illustrations/StudyIllustration";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left — Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-fuchsia-500 via-violet-600 to-purple-700 p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-1/4 right-8 h-40 w-40 rounded-full bg-teal-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center max-w-md text-center">
          <StudyIllustration className="w-full max-w-sm mb-8 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Bắt đầu hành trình
          </h2>
          <p className="text-fuchsia-100 text-lg leading-relaxed">
            Tạo tài khoản miễn phí và khám phá phương pháp học ngôn ngữ hiệu quả
          </p>
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gradient-to-br from-fuchsia-50/50 to-violet-50/30 p-6 sm:p-8">
        <Card className="w-full max-w-md border-0 bg-white/80 shadow-xl shadow-fuchsia-200/30 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-2">
            {/* Logo */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-300/50">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Tạo tài khoản
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-500">
                Bắt đầu hành trình học tập của bạn
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
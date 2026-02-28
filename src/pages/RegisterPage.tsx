import { GraduationCap } from "@phosphor-icons/react";
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
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary p-12 relative overflow-hidden">
        {/* Glassmorphism blobs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-8 h-48 w-48 rounded-full bg-accent/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center max-w-md text-center">
          <StudyIllustration className="w-full max-w-sm mb-8 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-3">
            Bắt đầu hành trình
          </h2>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            Tạo tài khoản miễn phí và khám phá phương pháp học ngôn ngữ hiệu quả
          </p>
        </div>
      </div>

      {/* Right — Register Form (Glassmorphism) */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <Card className="relative w-full max-w-md border border-white/60 bg-white/60 backdrop-blur-xl shadow-xl">
          <CardHeader className="space-y-4 text-center pb-2">
            {/* Logo */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Tạo tài khoản
              </CardTitle>
              <CardDescription className="mt-1.5">
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
import { GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <Card className="relative w-full max-w-md border border-white/60 bg-white/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Quên mật khẩu
            </CardTitle>
            <CardDescription className="mt-1.5">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { SpinnerGap, Lock, Eye, EyeSlash, CheckCircle, ArrowLeft } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { authService } from "@/services/authService";
import { getErrorMessage } from "@/types/api";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: values.newPassword,
      });
      setIsSuccess(true);
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const code = axiosError?.response?.data?.message ?? null;
      toast.error(getErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  // No token
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link to="/forgot-password">
            Yêu cầu liên kết mới
          </Link>
        </Button>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Mật khẩu đã được đặt lại
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
          </p>
        </div>
        <Button asChild className="w-full mt-2">
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Đăng nhập
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          Đặt lại mật khẩu
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ← Quay lại đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  );
}

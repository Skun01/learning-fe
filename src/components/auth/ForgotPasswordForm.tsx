import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { toast } from "sonner";
import { SpinnerGap as Loader2, EnvelopeSimple as Mail, ArrowLeft, CheckCircle as CheckCircle2 } from "@phosphor-icons/react";

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
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setIsSuccess(true);
      toast.success("Đã gửi email đặt lại mật khẩu!");
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const code = axiosError?.response?.data?.message ?? null;
      toast.error(getErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Kiểm tra email của bạn
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
            <span className="font-medium text-foreground">
              {form.getValues("email")}
            </span>
          </p>
        </div>
        <Button variant="outline" asChild className="w-full mt-2">
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Gửi liên kết đặt lại
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

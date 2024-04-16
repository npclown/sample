"use client";

import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

// TODO:: 입력 양식 정하기
const resetPasswordSchema = z.object({
  password: z.string().trim().min(8, {
    message: "비밀번호는 8자 이상이여야 합니다",
  }),
  password_confirm: z.string().trim().min(8, {
    message: "비밀번호는 8자 이상이여야 합니다",
  }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const defaultValues: Partial<ResetPasswordFormValues> = {
  password: "",
  password_confirm: "",
};

const ResetPasswordForm = ({ uidb64, token }: { uidb64: string; token: string }) => {
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async ({ password, password_confirm }: { password: string; password_confirm: string }) => {
      return await request.post(`/api/auth/change-password/?uidb64=${uidb64}&token=${token}`, {
        password,
        confirm_password: password_confirm,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("비밀번호가 변경되었습니다");
      router.push("/auth/login");
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
      form.reset();
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate({
      password: data.password,
      password_confirm: data.password_confirm,
    });
  };

  useEffect(() => {
    if (form) form.setFocus("password");
  }, [form]);

  return (
    <Form {...form}>
      <form
        className="mx-auto flex max-w-[400px] flex-col gap-4 md:max-w-none md:px-8"
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600 dark:text-gray-400">새 비밀번호</FormLabel>
              <FormControl>
                <Input placeholder="새로운 비밀번호를 입력해주세요" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600 dark:text-gray-400">새 비밀번호 확인</FormLabel>
              <FormControl>
                <Input placeholder="새로운 비밀번호를 다시한번 입력해주세요" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button className="w-full dark:bg-ionblue-500 hover:dark:bg-ionblue-400" type="submit">
            비밀번호 변경
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

"use client";

import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { useAuthStore } from "@/store/stores/use-auth-store";
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
const loginFormSchema = z.object({
  email: z.string().trim().email({
    message: "올바른 이메일 형식이 아닙니다",
  }),
  password: z.string().trim().min(8, {
    message: "비밀번호는 8자 이상이여야 합니다",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await request.post("/api/auth/login/", { email, password });
    },
    onSuccess: (data, variables, context) => {
      login(data.data.data);
      router.push("/");
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
      form.reset();
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  useEffect(() => {
    if (form) form.setFocus("email");
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600 dark:text-gray-400">이메일</FormLabel>
              <FormControl>
                <Input placeholder="이메일을 입력해주세요" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600 dark:text-gray-400">비밀번호</FormLabel>
              <FormControl>
                <Input placeholder="비밀번호를 입력해주세요" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button className="w-full dark:bg-ionblue-500 hover:dark:bg-ionblue-400" type="submit">
            로그인
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

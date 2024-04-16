"use client";

import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

// TODO:: 입력 양식 정하기
const resetFormSchema = z.object({
  email: z.string().trim().email(),
});

type ResetEmailFormValues = z.infer<typeof resetFormSchema>;

const defaultValues: Partial<ResetEmailFormValues> = {
  email: "",
};

const ResetEmailForm = () => {
  const [isSend, setIsSend] = useState(false);

  const form = useForm<ResetEmailFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await request.post("/api/auth/reset-password/", { email });
    },
    onSuccess: (data, variables, context) => setIsSend(true),
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
      form.reset();
    },
  });

  const onSubmit = (data: ResetEmailFormValues) => {
    mutation.mutate({
      email: data.email,
    });
  };

  useEffect(() => {
    if (form) form.setFocus("email");
  }, [form]);

  return isSend ? (
    <>
      <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-300 p-5">
        <picture>
          <img src="/img/email.png" alt="emailicon" className="size-16" />
        </picture>
        <h2 className="text-lg">이메일을 확인해주세요!</h2>
        <p className="text-gray-700">이메일을 확인하고 비밀번호를 재설정해주세요</p>
      </div>
      <div className="mt-4">
        <Button className="w-full">
          <Link href="/">메인 페이지로</Link>
        </Button>
      </div>
    </>
  ) : (
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
                <Input placeholder="이메일을 입력헤주세요" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button className="w-full dark:bg-ionblue-500 hover:dark:bg-ionblue-400" type="submit">
            링크 받기
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetEmailForm;

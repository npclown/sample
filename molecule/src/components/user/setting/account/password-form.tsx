"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const passwordFormSchema = z
  .object({
    password: z.string().trim().min(8, {
      message: "At least 8 Char",
    }),
    new_password: z.string().trim().min(8, {
      message: "At least 8 Char",
    }),
    new_password_check: z.string().trim().min(8, {
      message: "At least 8 Char",
    }),
  })
  .refine(
    (data) => {
      return data.new_password === data.new_password_check;
    },
    {
      message: "Passwords must match",
      path: ["new_password_check"],
    },
  );

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const defaultValues: Partial<PasswordFormValues> = {
  password: "",
  new_password: "",
  new_password_check: "",
};

const PasswordForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async ({ password, new_password }: { password: string; new_password: string }) => {
      return await request.patch("/api/user/password/", { password, new_password });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        toast.success("비밀번호 변경에 성공했습니다.");
        setIsOpen(false);
        form.reset();
      } else {
        toast.error("비밀번호 변경에 실패했습니다.");
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      if (response?.data?.data?.message) toast.error(response.data.data.message);
      else toast.warn("비밀번호 변경 중 문제가 발생하였습니다");
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    // TODO:: 사용자 비밀번호 변경
    mutation.mutate({
      password: data.password,
      new_password: data.new_password,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>비밀번호 변경</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 비밀번호</FormLabel>
                  <FormControl>
                    <Input placeholder="현재 비밀번호" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호</FormLabel>
                  <FormControl>
                    <Input placeholder="새 비밀번호" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password_check"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input placeholder="새 비밀번호 확인" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordForm;

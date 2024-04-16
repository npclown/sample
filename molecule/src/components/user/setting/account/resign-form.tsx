"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const resignText = "회원 탈퇴";

const resignFormSchema = z
  .object({
    resign: z.string().trim(),
    password: z.string().trim().min(8, {
      message: "At least 8 Char",
    }),
  })
  .refine(
    (data) => {
      return data.resign === resignText;
    },
    {
      message: "내용을 정확하게 입력해주세요",
      path: ["resign"],
    },
  );

type ResignFormValues = z.infer<typeof resignFormSchema>;

const defaultValues: Partial<ResignFormValues> = {
  password: "",
  resign: "",
};

const ResignForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  const form = useForm<ResignFormValues>({
    resolver: zodResolver(resignFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const mutationLogout = useMutation({
    mutationFn: async () => {
      return await request.post("/api/auth/logout/");
    },
    onSuccess: (data, variables, context) => {
      logout();
      toast.success("로그아웃 되었습니다.");
      router.push("/");
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.non_field_errors[0]);
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      return await request.post("/api/user/resign/", { password });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        toast.success("회원탈퇴에 성공했습니다.");
        setIsOpen(false);
        form.reset();
        mutationLogout.mutate();
      } else {
        toast.error("회원탈퇴에 실패했습니다.");
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;

      if (response?.data?.data?.message) {
        toast.error(response.data.data.message);
      } else {
        toast.warn("회원 탈퇴 중 문제가 발생하였습니다");
      }
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: ResignFormValues) => {
    // TODO:: 사용자 회원 탈퇴
    mutation.mutate({
      password: data.password,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">회원 탈퇴</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>회원 탈퇴</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회원 탈퇴 문구</FormLabel>
                  <FormControl>
                    <Input placeholder="회원 탈퇴" type="text" {...field} />
                  </FormControl>
                  <FormDescription>회원탈퇴를 원하시면 [회원 탈퇴] 문구를 입력해주세요.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="submit">회원 탈퇴</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResignForm;

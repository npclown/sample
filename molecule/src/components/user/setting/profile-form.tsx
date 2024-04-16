"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadProfileImage from "@/components/user/setting/upload-profile-image";
import request from "@/lib/api/request";
import { useAuthStore, useAuthUser } from "@/store/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const profileFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z.string().trim().email().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

export function ProfileForm() {
  const user = useAuthUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const toggleReload = useAuthStore((state) => state.toggleReload);

  useEffect(() => {
    form.reset({
      username: user?.nickname,
      email: user?.email,
    });
  }, [form, user]);

  const mutation = useMutation({
    mutationFn: async ({ nickname }: { nickname: string }) => {
      return await request.patch("/api/user/profile/", { nickname });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        toggleReload();
        toast.success("계정 정보 변경에 성공했습니다.");
      } else {
        toast.error("계정 정보 변경에 실패했습니다.");
      }
    },
    onError: (error, variables, context) => {
      toast.warn("계정 정보 변경 중 문제가 발생하였습니다");
    },
  });

  function onSubmit(data: ProfileFormValues) {
    mutation.mutate({ nickname: data.username });
  }

  if (!user) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
      {user && <UploadProfileImage image_url={user.profile?.image_url} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>공개적으로 표시될 닉네임을 지정합니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="email@email.com" {...field} readOnly />
                </FormControl>
                <FormDescription>이메일 주소를 변경합니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mx-auto block">
            프로필 저장
          </Button>
        </form>
      </Form>
    </div>
  );
}

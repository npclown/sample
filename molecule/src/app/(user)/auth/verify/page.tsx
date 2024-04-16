"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [verifyed, setVerifyed] = useState(false);

  const uidb64: string = searchParams.get("uidb64") || "";
  const token: string = searchParams.get("token") || "";

  const mutation = useMutation({
    mutationFn: async ({ uidb64, token }: { uidb64: string; token: string }) => {
      return await request.get("/api/auth/verify-email/", { params: { uidb64, token } });
    },
    onSuccess: (data, variables, context) => {
      toast.success("이메일 인증이 완료되었습니다.");
      setVerifyed(true);
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
    },
  });

  const handleVerifyEmail = () =>
    mutation.mutate({
      uidb64,
      token,
    });

  return (
    uidb64 !== "" &&
    token !== "" && (
      <>
        <div className="flex flex-col items-center gap-1">
          <h1 className="mb-2 flex items-center gap-2 font-sans text-2xl font-bold md:text-3xl">
            <Image width="56" height="36" src="/img/logo.png" alt="Ion" className="inline" />
            <span>이메일 인증</span>
          </h1>
          <div className="text-center font-sans text-sm text-gray-500 dark:text-gray-400 md:text-base">
            {verifyed ? "ION 커뮤니티 이메일이 완료되었습니다!" : "ION 커뮤니티 이메일 인증을 진행하시겠습니까?"}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mt-4">
          {verifyed ? (
            <Button className="w-full bg-ionblue-600">
              <Link href="/">메인페이지로</Link>
            </Button>
          ) : (
            <Button onClick={handleVerifyEmail} className="w-full">
              이메일 인증
            </Button>
          )}
        </div>

        {!verifyed && (
          <div className="mt-4">
            <Button className="w-full bg-red-500 hover:bg-red-400">
              <Link href="/">취소</Link>
            </Button>
          </div>
        )}
      </>
    )
  );
}

"use client";

import ResetEmailForm from "@/components/auth/reset-email-form";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const uidb64: string = searchParams.get("uidb64") || "";
  const token: string = searchParams.get("token") || "";

  return uidb64 !== "" && token !== "" ? (
    <>
      <div className="flex flex-col items-center gap-1">
        <h1 className="mb-2 flex items-center gap-2 font-sans text-2xl font-bold md:text-3xl">
          <Image width="56" height="36" src="/img/logo.png" alt="Ion" className="inline" />
          <span>비밀번호 재설정</span>
        </h1>
        <div className="text-center font-sans text-sm text-gray-500 dark:text-gray-400 md:text-base">
          비밀번호 재설정을 진행해주세요.
        </div>
      </div>

      <Separator className="my-6" />

      <ResetPasswordForm uidb64={uidb64} token={token} />

      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="flex items-center gap-1">
          아직 계정이 없으신가요?
          <Link href="/auth/signup" className="text-ionblue-600 transition hover:text-ionblue-800">
            회원가입
          </Link>
        </h3>
        <h3 className="flex items-center gap-1">
          이미 계정이 있으신가요?
          <Link href="/auth/login" className="text-ionblue-600 transition hover:text-ionblue-800 dark:text-ionblue-400">
            로그인
          </Link>
        </h3>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col items-center gap-1">
        <h1 className="mb-2 flex items-center gap-2 font-sans text-2xl font-bold md:text-3xl">
          <Image width="56" height="36" src="/img/logo.png" alt="Ion" className="inline" />
          <span>비밀번호 재설정</span>
        </h1>
        <div className="text-center font-sans text-sm text-gray-500 dark:text-gray-400 md:text-base">
          비밀번호 재설정을 위한 이메일 주소를 입력해주세요.
        </div>
      </div>

      <Separator className="my-6" />

      <ResetEmailForm />

      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="flex items-center gap-1">
          아직 계정이 없으신가요?
          <Link
            href="/auth/signup"
            className="text-ionblue-600 transition hover:text-ionblue-800 dark:text-ionblue-400"
          >
            회원가입
          </Link>
        </h3>
        <h3 className="flex items-center gap-1">
          이미 계정이 있으신가요?
          <Link href="/auth/login" className="text-ionblue-600 transition hover:text-ionblue-800 dark:text-ionblue-400">
            로그인
          </Link>
        </h3>
      </div>
    </>
  );
}

"use client";

import LoginForm from "@/components/auth/login-form";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/store/stores/use-auth-store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const user = useAuthUser();

  if (user) {
    router.push("/");
  }

  return (
    !user && (
      <>
        <div className="flex flex-col items-center gap-1">
          <h1 className="mb-2 flex items-center gap-2 font-sans text-2xl font-bold md:text-3xl">
            <Image width="56" height="36" src="/img/logo.png" alt="Ion" className="inline" />
            <span>로그인</span>
          </h1>
          <div className="text-center font-sans text-sm text-gray-500 dark:text-gray-400 md:text-base">
            지금 바로 Ion 에서 커뮤니티 활동을 시작해보세요.
          </div>
        </div>

        <Separator className="my-6" />

        <LoginForm />

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
            비밀번호를 잊으셨나요?
            <Link
              href="/auth/reset"
              className="text-ionblue-600 transition hover:text-ionblue-800 dark:text-ionblue-400"
            >
              비밀번호 찾기
            </Link>
          </h3>
        </div>
      </>
    )
  );
}

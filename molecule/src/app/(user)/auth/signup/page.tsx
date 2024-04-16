"use client";

import Policy from "@/components/auth/policy";
import SignupForm from "@/components/auth/signup-form";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/store/stores/use-auth-store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const user = useAuthUser();

  if (user) {
    router.push("/");
  }

  const [policy, setPolicy] = useState(false);

  return (
    !user && (
      <>
        <div className="flex flex-col items-center gap-1">
          <h1 className="mb-2 flex items-center gap-2 font-sans text-2xl font-bold md:text-3xl">
            <Image width="56" height="36" src="/img/logo.png" alt="Ion" className="inline" />
            <span>회원가입</span>
          </h1>
          <div className="text-center font-sans text-sm text-gray-500 dark:text-gray-400 md:text-base">
            1분 회원가입 후 바로 Ion 커뮤니티 활동을 시작해보세요.
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          {!policy && <Policy onSuccess={() => setPolicy(true)} />}
          {policy && <SignupForm />}
        </div>

        <div className="mt-8 flex justify-center">
          <h3 className="flex items-center gap-1">
            이미 계정이 있으신가요?
            <Link
              href="/auth/login"
              className="text-ionblue-600 transition hover:text-ionblue-800 dark:text-ionblue-400"
            >
              로그인
            </Link>
          </h3>
        </div>
      </>
    )
  );
}

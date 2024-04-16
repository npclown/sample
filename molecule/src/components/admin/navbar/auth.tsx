"use client";

import ThemeToggle from "@/components/admin/navbar/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserCard from "@/components/user-card";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { capitalize } from "@/lib/utils";
import { useAuthCheck } from "@/store/queries/user";
import { useAuthStore, useAuthUser } from "@/store/stores/use-auth-store";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Auth() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const user = useAuthUser();
  const reload = useAuthStore((state) => state.reload);
  const { logout, login } = useAuthStore();
  const { isError, data, isFetched, refetch } = useAuthCheck();

  const mutation = useMutation({
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
      toast.error(response?.data.data.non_field_errors[0]);
    },
  });

  useEffect(() => {
    if (isError) {
      logout();
    }

    if (isFetched) {
      login(data);
    }
  }, [data, isError, isFetched, login, logout]);

  useEffect(() => {
    refetch();
  }, [reload]);

  return (
    <div className="flex items-center gap-8 text-gray-500 dark:text-gray-400">
      {user ? (
        <>
          <Link href="/" className="transition hover:text-gray-900 dark:hover:text-gray-200">
            <span>Move to Ion</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 outline-none">
              <UserCard user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>계정 정보</DropdownMenuLabel>

              <div className="flex flex-col gap-1 p-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={`level-${user.profile.level}`}>{capitalize(user.profile.level)}</Badge>
                  <span>{user.points.point.toLocaleString()} eV</span>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/user/profile">프로필</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/user/setting">계정 관리</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="flex items-center justify-around gap-4">
                <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
                  <SunIcon />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
                  <MoonIcon />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setTheme("system")}>
                  <DesktopIcon />
                </Button>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => mutation.mutate()}>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="transition hover:text-gray-900 dark:hover:text-gray-200">
            <span>로그인</span>
          </Link>
          <Link href="/auth/signup" className="transition hover:text-gray-900 dark:hover:text-gray-200">
            <span>회원가입</span>
          </Link>
          <ThemeToggle />
        </>
      )}
    </div>
  );
}

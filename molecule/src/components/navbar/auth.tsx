"use client";

import ThemeToggle from "@/components/navbar/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import request from "@/lib/api/request";
import { CustomAxiosError, Level } from "@/lib/definitions";
import { nextLevel } from "@/lib/utils";
import { useAuthCheck } from "@/store/queries/user";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { MoonIcon, PencilIcon, SunIcon, UserIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import LevelBadge from "../level/level-badge";
import LevelProgress from "../level/level-progress";
import UserAvatar from "../user/user-avatar";

export default function Auth() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const reload = useAuthStore((state) => state.reload);
  const { login, logout } = useAuthStore();
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
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.non_field_errors[0]);
    },
  });

  const handleThemeChange = (checked: boolean) => {
    if (checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

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
    <div className="flex items-center gap-4 font-sans text-lg text-gray-500 dark:text-gray-400 md:gap-5 xl:gap-8">
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 outline-none">
              <UserAvatar name={user.nickname} profile_image={user.profile.image_url} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-6 w-[260px] p-0 md:mr-16">
              <div className="relative flex items-center gap-4 bg-ionblue-500 p-4">
                <UserAvatar className="size-12 flex-none" profile_image={user.profile.image_url} name={user.nickname} />
                <div className="flex min-w-0 flex-initial flex-col">
                  <div className="truncate text-lg text-gray-50">{user.nickname ? user.nickname : "No Nickname"}</div>
                  {user.profile.introduction && (
                    <div className="truncate text-xs text-gray-50">{user.profile.introduction}</div>
                  )}
                  <Link href="#" className="absolute right-2 top-2 ">
                    <PencilIcon className="size-4 text-gray-50" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <LevelProgress level={user.profile.level} point={user.points.point} />
                  <div className="grid w-full grid-cols-3 items-center justify-between gap-2 text-center">
                    <div className="flex justify-start">
                      <LevelBadge level={user.profile.level} />
                    </div>

                    <span className="text-xs">{user.points.point.toLocaleString()}eV 보유</span>
                    <div className="flex justify-end">
                      {nextLevel(user.profile.level) && (
                        <LevelBadge level={nextLevel(user.profile.level)!.toLowerCase() as Level} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer px-4 py-2">
                <Link href={`/portfolio/${user.profile.profile_url}`} className="flex items-center">
                  <UserIcon className="size-4 text-ionblue-500" />
                  <span className="ml-2 text-sm">포트폴리오</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer px-4 py-2">
                <Link href="/user/setting" className="flex items-center">
                  <Image src="/icon/ion.png" width={16} height={16} alt="ion" />
                  <span className="ml-2 text-sm">계정관리</span>
                </Link>
              </DropdownMenuItem>

              <div
                onClick={() => handleThemeChange(theme == "dark" ? false : true)}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-4 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                {theme == "dark" ? (
                  <MoonIcon className="size-4 text-ionblue-500" />
                ) : (
                  <SunIcon className="size-4 text-ionblue-500" />
                )}
                <span className="ml-2 text-sm">{theme == "dark" ? "다크모드" : "라이트모드"}</span>
                <Switch
                  className="ml-auto mr-0"
                  defaultChecked={theme == "dark"}
                  onCheckedChange={handleThemeChange}
                  checked={theme == "dark" ? true : false}
                />
              </div>

              <DropdownMenuItem
                className="flex cursor-pointer items-center px-4 py-2"
                onClick={(e) => mutation.mutate()}
              >
                <Image src="/icon/logout.png" width={16} height={16} alt="logout" />
                <span className="ml-2 text-sm">로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="text-sm transition hover:text-gray-900 dark:hover:text-gray-200 md:text-base"
          >
            <span>로그인</span>
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm transition hover:text-gray-900 dark:hover:text-gray-200 md:text-base"
          >
            <span>회원가입</span>
          </Link>
          <ThemeToggle />
        </>
      )}
    </div>
  );
}

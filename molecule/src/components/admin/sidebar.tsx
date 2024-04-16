"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  BorderStyleIcon,
  DashboardIcon,
  ImageIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbMoneybag } from "react-icons/tb";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-60 bg-gray-200 p-4 dark:bg-gray-700">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/dashboard",
          })}
          asChild
        >
          <Link href="/conductor/dashboard">
            <DashboardIcon className="mr-2 h-4 w-4" /> 대시보드
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/board",
          })}
          asChild
        >
          <Link href="/conductor/board">
            <ListBulletIcon className="mr-2 h-4 w-4" /> 게시판 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/category",
          })}
          asChild
        >
          <Link href="/conductor/category">
            <ListBulletIcon className="mr-2 h-4 w-4" /> 게시판 카테고리 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/user",
          })}
          asChild
        >
          <Link href="/conductor/user">
            <PersonIcon className="mr-2 h-4 w-4" /> 회원 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/role",
          })}
          asChild
        >
          <Link href="/conductor/role">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" /> 역할 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/skill",
          })}
          asChild
        >
          <Link href="/conductor/skill">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" /> 스킬 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600":
              pathname === "/conductor/calendar" || pathname.match("/conductor/calendar/.*$"),
          })}
          asChild
        >
          <Link href="/conductor/calendar">
            <CalendarIcon className="mr-2 h-4 w-4" /> 캘린더 목록
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/point",
          })}
          asChild
        >
          <Link href="/conductor/point">
            <TbMoneybag className="mr-2 h-4 w-4" /> 포인트 내역
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/banner",
          })}
          asChild
        >
          <Link href="/conductor/banner">
            <ImageIcon className="mr-2 h-4 w-4" /> 배너 관리
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={clsx("w-full justify-start hover:bg-gray-300", {
            "bg-gray-300 dark:bg-gray-600": pathname === "/conductor/navigation",
          })}
          asChild
        >
          <Link href="/conductor/navigation">
            <BorderStyleIcon className="mr-2 h-4 w-4" /> 네비게이션 관리
          </Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import Auth from "@/components/navbar/auth";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import NofiticationDialog from "../notification/notification-dialog";

export default function Navbar({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [show, setShow] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // 스크롤 허용
    } else {
      document.body.style.overflow = "visible"; // 스크롤 숨김
    }
  }, [show]);

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 dark:bg-gray-900 md:px-8">
      <Link className="hidden text-xl font-bold uppercase md:block" href="/">
        <Image width="64" height="40" src="/img/logo.png" alt="Ion" className="mx-8" priority />
      </Link>
      <div className="md:hidden">
        <Bars3Icon className="size-8 cursor-pointer md:hidden" onClick={(e) => setShow(true)} />
        {show && (
          <div className="absolute left-0 top-0 z-10 flex h-screen w-screen items-center bg-gray-300">
            <XMarkIcon className="absolute right-4 top-4 size-8 cursor-pointer" onClick={(e) => setShow(false)} />
            {children}
          </div>
        )}
      </div>

      <div className="hidden md:mx-auto md:block lg:ml-0">{children}</div>

      {user && <NofiticationDialog />}

      <Auth />
    </header>
  );
}

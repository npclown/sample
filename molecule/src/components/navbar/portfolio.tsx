"use client";

import "@/app/scrollbar.css";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/store/queries/portfolio/portfolio";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// TODO:: Ion 활동이력을 보는 페이지도 필요
const navbarList = [
  {
    desc: "portfolio",
    name: "포트폴리오",
    link: "/",
  },
  {
    desc: "profile & skill & 링크",
    name: "프로필",
    link: "/profile",
  },
  {
    desc: "tema & work",
    name: "소속·경력",
    link: "/experience",
  },
  {
    desc: "education",
    name: "교육이력",
    link: "/education",
  },
  {
    desc: "award",
    name: "수상이력",
    link: "/award",
  },

  {
    desc: "project",
    name: "프로젝트",
    link: "/project",
  },
  {
    desc: "presentation",
    name: "발표이력",
    link: "/presentation",
  },
  {
    desc: "report",
    name: "취약점제보",
    link: "/report",
  },
  {
    desc: "challenge",
    name: "문제 출제",
    link: "/challenge",
  },
  {
    desc: "activity",
    name: "활동내역",
    link: "/activity",
  },
];

const PortfolioNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname.split("/")[2];
  const link = pathname.split("/")[3] ?? "";

  const { isError } = usePortfolio(username);

  if (isError) {
    router.push("/");
    return <></>;
  }

  return (
    <div className="custom-scrollbar flex overflow-x-scroll">
      {navbarList.map((value, index) => {
        return (
          <Link
            key={value.desc}
            href={`/portfolio/${username}${value.link}`}
            className={cn(
              "min-w-fit rounded-t-xl border bg-[#ffffff] px-2 py-2 text-base text-sm hover:bg-ionblue-300 dark:bg-gray-700 dark:hover:bg-ionblue-800 md:px-4 md:text-base",
              {
                "bg-ionblue-500 dark:bg-ionblue-800": value.link == `/${link}`,
              },
            )}
          >
            {value.name}
          </Link>
        );
      })}
    </div>
  );
};

export default PortfolioNavbar;

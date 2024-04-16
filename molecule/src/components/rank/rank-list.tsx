"use client";

import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import Link from "next/link";

export default function Category({ name }: { name: string }) {
  const rankList = [
    {
      name: "all",
      label: "종합",
    },
    {
      name: "ev",
      label: "EV",
    },
    {
      name: "attendances",
      label: "출석",
    },
  ];

  // if (isError || isLoading) return <></>;

  return (
    <div className="flex w-full justify-between text-base md:text-xl">
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
      {rankList?.map((c, index) => (
        <Link
          key={index}
          href={`/ranking/${c.name}`}
          className={clsx(
            "flex flex-1 cursor-pointer items-center justify-center border-b-[2px] border-r-[1px] border-t-[1px] border-y-black bg-gray-100 dark:border-y-gray-400 dark:bg-gray-700",
            c.name === name &&
              "border-x-[1px] border-b-0 border-t-[3px] border-x-black border-b-transparent border-t-ionblue-500 bg-white dark:border-x-gray-300 dark:border-b-gray-700",
          )}
        >
          <span>{c.label}</span>
        </Link>
      ))}
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
    </div>
  );
}

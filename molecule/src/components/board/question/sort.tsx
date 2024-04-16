"use client";

import { generatorBoardUrl } from "@/lib/utils";
import { useBoardStore } from "@/store/stores/use-board-store";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function SortPost({ category }: { category: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sortList = [
    {
      name: "",
      label: "최신순",
    },
    {
      name: "accepting_points",
      label: "ev순",
    },
    {
      name: "accepted",
      label: "채택됨",
    },
    {
      name: "not_accepted",
      label: "채택안됨",
    },
  ];

  const board = useBoardStore((state) => state.board);
  const boardType = board?.type == "question" ? "questions" : "boards";
  const sort = searchParams.get("sort") ?? "";
  const searchType = searchParams.get("type") ?? "";
  const searchKeyword = searchParams.get("keyword") ?? "";

  const handleSortChange = (sort: string) => {
    const url = generatorBoardUrl(boardType, board!.name, category, searchKeyword, searchType, sort);
    router.push(url);
  };

  return (
    <div className="ml-auto mr-0 flex gap-2 text-sm md:gap-3 md:text-base">
      {sortList.map((item, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center"
          onClick={() => {
            handleSortChange(item.name);
          }}
        >
          {sort === item.name && <CheckIcon className="size-5 text-black dark:text-gray-300" />}
          <span className={sort === item.name ? "text-black dark:text-gray-300" : ""}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

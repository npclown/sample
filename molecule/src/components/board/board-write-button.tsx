"use client";

import { useBoardStore } from "@/store/stores/use-board-store";
import { PencilIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import { Button } from "../ui/button";

const BoardWriteButton = () => {
  const board = useBoardStore((state) => state.board);

  return (
    <div className="flex items-end justify-end">
      <Button asChild className="h-7 bg-ionblue-500 px-5 text-xs dark:bg-gray-300 md:h-8 md:text-base">
        <Link href={`/boards/${board?.name}/create`} className="flex items-center gap-1">
          <PencilIcon className="size-3 md:size-4" />
          <span>글 작성</span>
        </Link>
      </Button>
    </div>
  );
};

export default BoardWriteButton;

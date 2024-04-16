"use client";

import BoardWriteSkeleton from "@/components/board/write-skeleton";
import PostForm from "@/components/post/post-form";
import { useBoardStore } from "@/store/stores/use-board-store";

export default function Page({ params }: { params: { board: string } }) {
  const board = useBoardStore((state) => state.board);

  if (!!!board) {
    return <BoardWriteSkeleton />;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 md:text-2xl">{board.label} 글 작성</h2>
      <PostForm mode={"create"} boardId={params.board} />
    </>
  );
}

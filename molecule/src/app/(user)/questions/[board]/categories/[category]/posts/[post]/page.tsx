"use client";

import BoardSkeleton from "@/components/board/skeleton";
import PostView from "@/components/question/view";
import { useBoardStore } from "@/store/stores/use-board-store";

export default function Page({ params }: { params: { board: string; category: string; post: string } }) {
  const board = useBoardStore((state) => state.board);

  if (!board) return <BoardSkeleton />;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-3 shadow-md dark:bg-gray-800 md:gap-8 md:px-10 md:py-8 xl:px-32 xl:py-12 xl:dark:bg-gray-700">
      <PostView boardId={params.board} categoryId={params.category} postId={params.post} />
    </div>
  );
}

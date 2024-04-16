"use client";

import BoardWriteSkeleton from "@/components/board/write-skeleton";
import QuestionForm from "@/components/question/question-form";
import { useBoardStore } from "@/store/stores/use-board-store";

export default function Page({ params }: { params: { board: string; category: string } }) {
  const board = useBoardStore((state) => state.board);

  if (!!!board) {
    return <BoardWriteSkeleton />;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 md:text-2xl">{board.label} 질문 작성</h2>
      <QuestionForm mode={"create"} boardId={params.board} />
    </>
  );
}

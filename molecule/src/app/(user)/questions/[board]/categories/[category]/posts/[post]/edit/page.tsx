"use client";

import BoardWriteSkeleton from "@/components/board/write-skeleton";
import QuestionForm from "@/components/question/question-form";
import { usePost } from "@/store/queries/board/post/retrieve";
import { useBoardStore } from "@/store/stores/use-board-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page({ params }: { params: { board: string; category: string; post: string } }) {
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(params.board, params.category, params.post, { retry: 1 });
  const board = useBoardStore((state) => state.board);

  if (isLoading || !!!board) {
    return <BoardWriteSkeleton />;
  }

  if (isError) {
    toast.error("존재하지 않는 게시글 입니다.");
    router.push(`/boards/${params.board}`);
    return <></>;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 md:text-2xl">질문 수정</h2>
      <QuestionForm mode={"edit"} boardId={params.board} post={post} />
    </>
  );
}

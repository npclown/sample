"use client";

import { useBoard } from "@/store/queries/board/retrieve";
import { useBoardStore } from "@/store/stores/use-board-store";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const { board: boardId } = useParams();
  const router = useRouter();
  const { data: board, isLoading, isError } = useBoard(boardId as string, { enabled: boardId != null });
  const setBoard = useBoardStore((state) => state.setBoard);

  useEffect(() => {
    if (board) setBoard(board);
  }, [board, setBoard, boardId]);

  if (isError) {
    toast.error("존재하지 않는 게시판 입니다.");
    router.push(`/`);
    return <></>;
  }

  return <>{children}</>;
};

export default BoardProvider;

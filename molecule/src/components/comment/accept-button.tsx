"use client";

import request from "@/lib/api/request";
import { useBoardStore } from "@/store/stores/use-board-store";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const AcceptButton = ({
  boardId,
  categoryId,
  postId,
  commentId,
  point,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  commentId: string;
  point: number;
}) => {
  const toggleCommentReload = useBoardStore((state) => state.toggleCommentReload);
  const togglePostReload = useBoardStore((state) => state.togglePostReload);

  const acceptAnswer = useMutation({
    mutationFn: () =>
      request.post(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${commentId}/accept/`),
    onSuccess: (response) => {
      togglePostReload();
      toggleCommentReload();
      toast.success("답변 채택을 완료하였습니다");
    },
    onError: (err) => {
      toast.error("답변 채택에 실패하였습니다");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button className="mr-2 flex flex-col items-center rounded-lg p-1 text-sm text-gray-500 transition hover:text-gray-400 dark:text-gray-300 md:text-base">
          <CheckCircleIcon className="inline-block size-6 md:size-8" />
          <span>채택</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <h1 className="font-sans text-base font-bold">질문 채택 확인</h1>
        </AlertDialogHeader>

        <span>
          정말로 이 답변을 채택하시겠습니까?
          <br />({point.toLocaleString()} eV가 상대방에게 지급됩니다.)
        </span>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel>닫기</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => acceptAnswer.mutate()}>채택하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptButton;

import request from "@/lib/api/request";
import { useBoardStore } from "@/store/stores/use-board-store";
import { EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

const CommentControlButton = ({
  boardId,
  categoryId,
  postId,
  commentId,
  nested,
  handleEditClick,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  commentId: string;
  nested: boolean;
  handleEditClick: Function;
}) => {
  const router = useRouter();

  const board = useBoardStore((state) => state.board);

  const toggleCommentReload = useBoardStore((state) => state.toggleCommentReload);
  const togglePostReload = useBoardStore((state) => state.togglePostReload);

  const commentDelete = useMutation({
    mutationFn: () =>
      request.delete(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${commentId}/`),
    onSuccess: (response) => {
      toggleCommentReload();
      togglePostReload();
      toast.success("댓글을 삭제하였습니다");

      router.push(
        board?.type === "question"
          ? `/questions/${boardId}/categories/${categoryId}/posts/${postId}`
          : `/boards/${boardId}/categories/${categoryId}/posts/${postId}`,
      );
    },
    onError: (err) => {
      toast.error("댓글 삭제에 실패하였습니다");
    },
  });

  return (
    <>
      {!nested && <Separator orientation="vertical" className="h-4" />}
      <AlertDialog>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex items-center" asChild>
            <EllipsisHorizontalIcon className="size-7 cursor-pointer rounded-md p-1 text-gray-600 transition hover:bg-gray-200 dark:text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEditClick()} className="flex items-center gap-2">
              <PencilSquareIcon className="size-4 text-gray-600 dark:text-gray-400" />
              <span>수정</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialogTrigger className="flex w-full items-center gap-2">
                <TrashIcon className="size-4 text-gray-600 dark:text-gray-400" />
                <span>삭제</span>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => commentDelete.mutate()}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CommentControlButton;

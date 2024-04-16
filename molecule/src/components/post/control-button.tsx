import request from "@/lib/api/request";
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

const PostControlButton = ({ boardId, postId }: { boardId: string; postId: number }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/boards/${boardId}/posts/${postId}/edit`);
  };

  const postDelete = useMutation({
    mutationFn: () => {
      return request.delete(`/api/boards/${boardId}/posts/${postId}/`);
    },
    onSuccess: () => {
      toast.success("게시글을 삭제하였습니다");
      router.push(`/boards/${boardId}`);
    },
    onError: () => {
      toast.error("게시글 삭제에 실패했습니다");
    },
  });

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleEdit()} className="flex items-center gap-2">
            <PencilSquareIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <AlertDialogTrigger className="flex w-full items-center gap-2">
              <TrashIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>삭제</span>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글 삭제 확인</AlertDialogTitle>
          <AlertDialogDescription>게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={() => postDelete.mutate()}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostControlButton;

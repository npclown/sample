import request from "@/lib/api/request";
import { useBoardStore } from "@/store/stores/use-board-store";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const CommentLikebutton = ({
  boardId,
  categoryId,
  postId,
  commentId,
  commentLiked,
  totalLike = 0,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  commentId: string;
  commentLiked: boolean;
  totalLike: number;
}) => {
  const [liked, setLiked] = useState<boolean>(commentLiked);
  const toggleCommentReload = useBoardStore((state) => state.toggleCommentReload);

  const commentLike = useMutation({
    mutationFn: () =>
      request.post(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${commentId}/like/`),
    onSuccess: (response) => {
      setLiked(true);
      toggleCommentReload();
      toast.success("댓글을 추천하였습니다");
    },
    onError: (err) => {
      toast.error("추천 중 오류가 발생했습니다");
    },
  });

  const commentUnLike = useMutation({
    mutationFn: () =>
      request.delete(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${commentId}/like/`),
    onSuccess: (response) => {
      setLiked(false);
      toggleCommentReload();
      toast.warning("댓글 추천을 취소했습니다");
    },
    onError: (err) => {
      toast.error("추천 취소 중 오류가 발생했습니다");
    },
  });

  const handleLikeClick = useCallback(() => {
    if (!!!liked) {
      commentLike.mutate();
    } else {
      commentUnLike.mutate();
    }
  }, [liked, commentLike, commentUnLike]);

  return (
    <button
      type="button"
      onClick={() => handleLikeClick()}
      className={clsx(
        "flex select-none items-center gap-1 rounded-full px-2 text-white transition xl:px-3 xl:py-[2px]",
        {
          "bg-ionblue-500": liked,
          "bg-gray-400 hover:bg-gray-500": !liked,
        },
      )}
    >
      <HandThumbUpIcon className="size-3 xl:size-4" />
      <span className="text-sm">{totalLike}</span>
    </button>
  );
};

export default CommentLikebutton;

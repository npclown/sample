"use client";

import request from "@/lib/api/request";
import { useBoardStore } from "@/store/stores/use-board-store";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

const PostLikeButton = ({
  boardId,
  categoryId,
  postId,
  postLiked,
  totalLike = 0,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  postLiked: boolean;
  totalLike: number;
}) => {
  const [liked, setLiked] = useState<boolean>(postLiked);
  const [likedCount, setLikedCount] = useState<number>(totalLike);
  const togglePostReload = useBoardStore((state) => state.togglePostReload);

  const postLike = useMutation({
    mutationFn: () => {
      return request.post(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/like/`);
    },
    onSuccess: () => {
      setLikedCount((prev) => prev + 1);
      setLiked(true);
      togglePostReload();
      toast.success("게시글을 추천하였습니다");
    },
    onError: () => {
      toast.error("게시글 추천에 실패했습니다");
    },
  });

  const postUnLike = useMutation({
    mutationFn: () => {
      return request.delete(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/like/`);
    },
    onSuccess: () => {
      setLikedCount((prev) => prev - 1);
      togglePostReload();
      setLiked(false);
      toast.warning("게시글 추천을 취소했습니다");
    },
    onError: () => {
      toast.error("게시글 추천 취소에 실패했습니다");
    },
  });

  const handleLikeClick = useCallback(() => {
    if (!!!liked) {
      postLike.mutate();
    } else {
      postUnLike.mutate();
    }
  }, [liked, postLike, postUnLike]);

  useLayoutEffect(() => {
    setLikedCount(totalLike);
  }, [totalLike]);

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={(e) => handleLikeClick()}
        className={clsx(
          "flex cursor-pointer select-none items-center gap-1 rounded-full px-5 py-1 text-white transition xl:gap-2",
          {
            "bg-ionblue-500": liked,
            "bg-gray-400 hover:bg-gray-500": !liked,
          },
        )}
      >
        <HandThumbUpIcon className="size-4 md:size-5" />
        <span className="text-sm md:text-base">{likedCount}</span>
      </button>
    </div>
  );
};

export default PostLikeButton;

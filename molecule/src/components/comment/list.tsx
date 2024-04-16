"use client";

import type { Comment, Post } from "@/lib/definitions";
import { useCommentList } from "@/store/queries/board/post/comment/list";
import { useBoardStore } from "@/store/stores/use-board-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { toast } from "react-toastify";

import CustomPagination from "../common/pagination";
import { Separator } from "../ui/separator";
import CommentForm from "./form";
import CommentSkeleton from "./skeleton";
import CommentView from "./view";

const CommentList = ({
  boardId,
  categoryId,
  postId,
  post,
  type = "comment",
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  post: Post;
  type?: "comment" | "answer";
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentReload = useBoardStore((state) => state.commentReload);

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const {
    data: comments,
    isLoading,
    isError,
    refetch,
  } = useCommentList(boardId, categoryId, postId, page, { retry: 1 });

  useLayoutEffect(() => {
    refetch();
  }, [commentReload, refetch]);

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    comments && (
      <div>
        <Separator className="dark:bg-gray-500" />

        {comments.data?.map((comment: Comment) => {
          return (
            <div key={comment.id}>
              <CommentView boardId={boardId} categoryId={categoryId} postId={postId} comment={comment} />
              <Separator className="dark:bg-gray-500" />
            </div>
          );
        })}

        {comments.data.length > 0 && (
          <div className="my-5">
            <CustomPagination query={""} page={page} totalCount={comments.count} limit={15} />
          </div>
        )}

        <CommentForm mode="create" type={type} boardId={boardId} categoryId={categoryId} postId={postId} />
      </div>
    )
  );
};

export default CommentList;

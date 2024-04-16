"use client";

import CommentList from "@/components/comment/list";
import { usePost } from "@/store/queries/board/post/retrieve";
import { useBoardStore } from "@/store/stores/use-board-store";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { toast } from "react-toastify";

import ParsedContent from "../board/parsed-content";
import { Separator } from "../ui/separator";
import PostInfo from "./info";
import PostSkeleton from "./skeleton";

const PostView = ({ boardId, categoryId, postId }: { boardId: string; categoryId: string; postId: string }) => {
  const router = useRouter();
  const postReload = useBoardStore((state) => state.postReload);
  const setPost = useBoardStore((state) => state.setPost);
  const {
    data: postInfo,
    isLoading,
    isError,
    refetch,
  } = usePost(boardId, categoryId, postId, {
    retry: 1,
  });

  useLayoutEffect(() => {
    if (postInfo) {
      setPost(postInfo);
    }
  }, [postInfo, setPost]);

  useLayoutEffect(() => {
    refetch();
  }, [postReload, refetch]);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isError) {
    toast.error("존재하지 않는 게시글 입니다.");
    router.push(`/questions/${boardId}`);
    return <></>;
  }

  return (
    postInfo && (
      <div className="flex flex-col gap-3">
        <PostInfo post={postInfo} />
        <Separator className="h-[2px] dark:bg-gray-500" />
        <ParsedContent>{postInfo.content}</ParsedContent>

        {/* <div className="flex w-full items-end justify-end text-sm text-gray-400">
          <Link href="/report">신고하기</Link>
        </div> */}

        <Separator className="h-[2px] dark:bg-gray-500" />

        <div className="flex items-center gap-1 text-sm dark:text-gray-200 xl:text-lg">
          <ChatBubbleLeftEllipsisIcon className="size-5 xl:size-7" />
          <span>답변 {postInfo.comment_count}</span>
        </div>

        <CommentList boardId={boardId} categoryId={categoryId} postId={postId} type="answer" post={postInfo} />
      </div>
    )
  );
};

export default PostView;

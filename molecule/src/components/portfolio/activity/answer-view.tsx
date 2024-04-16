"use client";

import { DistanceTime } from "@/components/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import request from "@/lib/api/request";
import { BookmarkIcon, ChatBubbleLeftEllipsisIcon, HandThumbUpIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

import CustomParsedContent from "./custom-parsed-content";

const AnswerView = ({ answerInfo, refetch }: { answerInfo: any; refetch: () => void }) => {
  const [like, setLike] = useState<boolean>(answerInfo.liked);
  const [likeCount, setLikeCount] = useState<number>(answerInfo.like_count);
  const commentLike = useMutation({
    mutationFn: async () => {
      return await request.post(
        `/api/boards/${answerInfo.post.category.board.name}/categories/${answerInfo.post.category.name}/posts/${answerInfo.post.id}/comments/${answerInfo.id}/like/`,
      );
    },
    onSuccess: () => {
      setLikeCount((prev) => prev + 1);
      setLike(true);
      refetch();
      toast.success("댓글을 추천하였습니다");
    },
    onError: () => {
      toast.error("댓글 추천에 실패했습니다");
    },
  });

  const commentUnLike = useMutation({
    mutationFn: async () => {
      return await request.delete(
        `/api/boards/${answerInfo.post.category.board.name}/categories/${answerInfo.post.category.name}/posts/${answerInfo.post.id}/comments/${answerInfo.id}/like/`,
      );
    },
    onSuccess: () => {
      setLikeCount((prev) => prev - 1);
      setLike(false);
      refetch();
      toast.warning("댓글 추천을 취소했습니다");
    },
    onError: () => {
      toast.error("댓글 추천 취소에 실패했습니다");
    },
  });

  // 공유하기
  const copyToClipboard = async (textToCopy: string) => {
    const hostWithPort = window.location.host;
    const copy = `http://${hostWithPort}${textToCopy}`;

    if ("clipboard" in navigator) {
      // navigator.clipboard API를 사용할 수 있는 경우
      try {
        await navigator.clipboard.writeText(copy);
        toast.success("클립보드에 복사되었습니다!");
      } catch (err) {
        // 클립보드에 복사 실패
        toast.error("클립보드에 복사를 실패했습니다.");
      }
    } else {
      // document.execCommand를 통한 대체 방법 (구형 브라우저 대응)
      const textarea = document.createElement("textarea");
      textarea.value = copy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-start">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border md:size-14">
            <AvatarImage src={answerInfo.user.profile.image_url} alt="profile_image" />
            <AvatarFallback>{answerInfo.user.nickname}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm font-semibold">{answerInfo.user.nickname}</div>
            <div className="text-xs">{answerInfo.user.affilication}</div>
            <DistanceTime className="text-xs" time={answerInfo.created_at} />
          </div>
        </div>
        <ShareIcon
          className="ml-auto mr-0 size-5 cursor-pointer"
          onClick={async (e) =>
            copyToClipboard(
              `/questions/${answerInfo.post.category.board.name}/categories/${answerInfo.post.category.name}/posts/${answerInfo.post.id}`,
            )
          }
        />
      </div>
      <div className="rounded-md border p-4">
        <div className="inline-flex size-5 items-center justify-center rounded-md bg-[#CCE0FF] text-center font-bold text-[#00BFFF]">
          Q
        </div>
        <div className="font-semibold">{answerInfo.post.title}</div>
        <CustomParsedContent>{answerInfo.post.content}</CustomParsedContent>
      </div>
      <CustomParsedContent>{answerInfo.content}</CustomParsedContent>
      <div className="flex items-center gap-4">
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={(e) => {
            like ? commentUnLike.mutate() : commentLike.mutate();
          }}
        >
          <HandThumbUpIcon className={like ? "size-5 text-ionblue-500" : "size-5"} />
          <span className={like ? "text-xs text-ionblue-500" : "text-xs text-[#64748B]"}>좋아요 {likeCount}</span>
        </div>
        <Link
          className="flex cursor-pointer items-center gap-1"
          href={`/questions/${answerInfo.post.category.board.name}/categories/${answerInfo.post.category.name}/posts/${answerInfo.post.id}`}
        >
          <ChatBubbleLeftEllipsisIcon className="size-5 " />
          <span className="text-xs text-[#64748B]">댓글 {answerInfo.comments.length}</span>
        </Link>
        <BookmarkIcon className="ml-auto mr-0 size-5 cursor-pointer" onClick={(e) => alert("포스트 저장")} />
      </div>
    </div>
  );
};

export default AnswerView;

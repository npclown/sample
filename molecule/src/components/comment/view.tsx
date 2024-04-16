import { Badge } from "@/components/ui/badge";
import type { Comment } from "@/lib/definitions";
import { capitalize, nextLevel, nextLevelPoint } from "@/lib/utils";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { useBoardStore } from "@/store/stores/use-board-store";
import clsx from "clsx";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

import ParsedContent from "../board/parsed-content";
import { DistanceTime } from "../time";
import { Separator } from "../ui/separator";
import UserCard from "../user-card";
import AcceptButton from "./accept-button";
import CommentControlButton from "./control-button";
import CommentForm from "./form";
import CommentLikebutton from "./like-button";
import CommentReplyButton from "./reply-button";

const CommentView = ({
  boardId,
  categoryId,
  postId,
  comment,
  nested = false,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  comment: Comment;
  nested?: boolean;
}) => {
  const user = useAuthStore((state) => state.user);
  const post = useBoardStore((state) => state.post);
  const [isReplyMode, setIsReplyMode] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const isDesktop = useMediaQuery({ minDeviceWidth: 1280 });

  return (
    <div className="flex gap-2">
      <div
        className={clsx("flex flex-1 flex-col bg-white dark:bg-inherit xl:dark:bg-gray-700", {
          "py-2 md:py-5": !nested,
          "pl-5 md:pl-10": nested,
        })}
      >
        {!nested && post?.question && post?.question?.accepted_comment?.id == comment?.id && (
          <div className="mb-2 ml-2 flex items-center gap-1 md:ml-3 xl:ml-2">
            <picture>
              <img src="/img/accepted.png" className="size-6 xl:size-8" alt="accepted" />
            </picture>
            <h2 className="font-sans text-sm font-bold text-red-400 dark:text-red-300 xl:text-base">
              질문자가 채택한 답변입니다
            </h2>
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex items-center gap-2 px-2 text-xs md:text-sm xl:text-base">
            <UserCard user={comment.user} />
            {isDesktop && (
              <Badge variant={`level-${comment.user.profile.level}`}>{capitalize(comment.user.profile.level)}</Badge>
            )}
          </div>

          <div className="flex items-center xl:gap-1">
            <CommentLikebutton
              boardId={boardId}
              categoryId={categoryId}
              postId={postId}
              commentId={comment.id}
              commentLiked={comment.liked}
              totalLike={comment.like_count}
            />

            {!nested && <CommentReplyButton handleReplyClick={() => setIsReplyMode(true)} />}

            {user && user.id === comment.user.id && post?.question?.accepted_comment?.id !== comment.id && (
              <CommentControlButton
                boardId={boardId}
                categoryId={categoryId}
                postId={postId}
                commentId={comment.id}
                nested={nested ? true : false}
                handleEditClick={() => setIsEditMode(true)}
              />
            )}
          </div>
        </div>

        {isEditMode ? (
          <div className="mt-4 rounded-md border border-gray-300">
            <CommentForm
              mode="edit"
              boardId={boardId}
              categoryId={categoryId}
              postId={postId}
              comment={comment}
              toggleMode={() => setIsEditMode(false)}
            />
          </div>
        ) : (
          <div className="pl-14">
            <div className="flex justify-between break-all">
              <ParsedContent>{comment.content}</ParsedContent>

              {/* TODO:: 추후 다른 방법으로 변화가 필요 */}
              {!nested && post?.question && post?.user.id === user?.id && post?.question?.accepted_comment == null && (
                <AcceptButton
                  boardId={boardId}
                  categoryId={categoryId}
                  postId={postId}
                  commentId={comment.id}
                  point={post?.question?.accepting_points ?? 0}
                />
              )}
            </div>

            <div className="flex w-full justify-between">
              <DistanceTime className="text-xs" time={comment.created_at} />
              {/* <span className="text-gray-400">신고하기</span> */}
            </div>
          </div>
        )}

        {isReplyMode && (
          <CommentForm
            mode="reply"
            boardId={boardId}
            categoryId={categoryId}
            postId={postId}
            comment={comment}
            toggleMode={() => setIsReplyMode(false)}
          />
        )}

        {comment.comments.map((nested_comment: Comment) => (
          <>
            <Separator className="my-4" />
            <CommentView
              key={nested_comment.id}
              boardId={boardId}
              categoryId={categoryId}
              postId={postId}
              comment={nested_comment}
              nested={true}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default CommentView;

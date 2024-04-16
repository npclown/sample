import request from "@/lib/api/request";
import { Comment as CommentType, Post as PostType } from "@/lib/definitions";
import { useBoardStore } from "@/store/stores/use-board-store";
import { ChevronDoubleUpIcon, PencilIcon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

const CommentForm = ({
  boardId,
  categoryId,
  postId,
  mode,
  comment,
  type = "comment",
  toggleMode,
}: {
  boardId: string;
  categoryId: string;
  postId: string;
  mode: "create" | "edit" | "reply";
  comment?: CommentType;
  type?: "comment" | "answer";
  toggleMode?: () => void;
}) => {
  const theme = useTheme();
  const [content, setContent] = useState<string>(mode === "edit" ? comment?.content ?? "" : "");
  const toggleCommentReload = useBoardStore((state) => state.toggleCommentReload);
  const togglePostReload = useBoardStore((state) => state.togglePostReload);

  const [disabled, setDisabled] = useState<boolean>(false);

  const isLaptop = useMediaQuery({ minDeviceWidth: 768 });

  const prefix = type === "answer" ? "답변" : "댓글";

  const createComment = useMutation({
    mutationFn: (data: { content: string }) => {
      if (!content) toast.error(`내용은 비울 수 없습니다`);

      setDisabled(true);

      return request.post(`/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/`, data);
    },
    onSuccess: () => {
      setContent("");
      toggleCommentReload();
      togglePostReload();
      toast.success(`${prefix}이 작성되었습니다`);
    },
    onError: () => {
      toast.error("댓글 작성에 실패했습니다");
      setDisabled(false);
    },
  });
  const editComment = useMutation({
    mutationFn: (data: { content: string }) => {
      if (!content) toast.error(`내용은 비울 수 없습니다`);

      setDisabled(true);

      return request.patch(
        `/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${comment?.id}/`,
        data,
      );
    },
    onSuccess: () => {
      toggleCommentReload();
      toggleMode && toggleMode();
      toast.success(`${prefix}이 수정되었습니다`);
    },
    onError: () => {
      toast.error("댓글 수정에 실패했습니다");
      setDisabled(false);
    },
  });
  const replyComment = useMutation({
    mutationFn: (data: { content: string }) => {
      if (!content) toast.error(`내용은 비울 수 없습니다`);

      setDisabled(true);

      return request.post(
        `/api/boards/${boardId}/categories/${categoryId}/posts/${postId}/comments/${comment?.id}/comments/`,
        data,
      );
    },
    onSuccess: () => {
      setContent("");
      toggleCommentReload();
      togglePostReload();
      toggleMode && toggleMode();
      toast.success("답글이 작성되었습니다");
    },
    onError: () => {
      toast.error("답글 작성에 실패했습니다");
      setDisabled(false);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!content) return;

      if (mode === "create") {
        createComment.mutate({ content: content });
      } else if (mode === "edit") {
        editComment.mutate({ content: content });
      } else if (mode === "reply") {
        replyComment.mutate({ content: content });
      }
    },
    [mode, content, createComment, editComment, replyComment],
  );

  return (
    <form
      className="flex flex-col gap-2 rounded-lg bg-white p-2 dark:bg-gray-700 xl:gap-4 xl:p-4"
      onSubmit={handleSubmit}
    >
      <span className="text-base dark:text-gray-200 xl:text-xl">
        {mode === "create" && `${prefix} 작성`}
        {mode === "edit" && `${prefix} 수정`}
        {mode === "reply" && "답글 작성"}
      </span>

      <div
        data-color-mode={theme.theme}
        className="overflow-hidden rounded-lg border border-gray-300 dark:border-transparent"
      >
        <MDEditor
          lang="ko-KR"
          value={content}
          hideToolbar={isLaptop ? false : true}
          previewOptions={{ style: { backgroundColor: theme.theme === "dark" ? "#4b5564" : "#ffffff" } }}
          className="dark:bg-gray-600"
          preview={isLaptop ? "live" : "edit"}
          height={isLaptop ? 200 : 100}
          onChange={(value) => {
            setContent(value ?? "");
          }}
        />
      </div>

      <div className="flex w-full justify-between">
        <button
          type="submit"
          className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-ionblue-500 px-4 py-1 text-sm text-slate-100 shadow-md xl:text-base"
          disabled={disabled}
        >
          <PencilIcon className="size-5" />
          <span>{mode === "edit" ? "수정" : "작성"}</span>
        </button>

        {mode === "create" && (
          <div className="flex gap-2">
            <Link
              href={`/${type == "answer" ? "questions" : "boards"}/${boardId}?category=${categoryId}`}
              className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-200 px-4 py-1 text-sm shadow-md dark:bg-gray-400 xl:text-base"
            >
              <span>목록</span>
            </Link>

            <button
              className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-200 px-4 py-1 text-sm shadow-md dark:bg-gray-400 xl:text-base"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ChevronDoubleUpIcon className="size-5" />
              <span>위로</span>
            </button>
          </div>
        )}

        {(mode === "edit" || mode === "reply") && (
          <button
            onClick={() => {
              toggleMode && toggleMode();
            }}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-200 px-4 py-1 text-sm text-gray-800 shadow-md dark:bg-gray-400 dark:text-slate-100 xl:text-base"
          >
            <ArrowUturnLeftIcon className="size-5" />
            <span>취소</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;

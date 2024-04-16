"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import request from "@/lib/api/request";
import { Post as PostType } from "@/lib/definitions";
import { useCategoryList } from "@/store/queries/board/category/list";
import { ArrowUturnLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import rehypeSanitize from "rehype-sanitize";

import Code from "./common-form";
import QuestionWriteButton from "./question-write-button";

const QuestionForm = ({ mode, boardId, post }: { mode: "create" | "edit"; boardId: string; post?: PostType }) => {
  const theme = useTheme();
  const router = useRouter();

  const [disabled, setDisabled] = useState<boolean>(false);

  const [category, setCategory] = useState<string>(mode === "edit" ? post?.category.name ?? "" : "");
  const [title, setTitle] = useState<string>(mode === "edit" ? post?.title ?? "" : "");
  const [content, setContent] = useState<string>(mode === "edit" ? post?.content ?? "" : "");
  const [acceptPoint, setAcceptPoint] = useState<number>(mode === "edit" ? post?.question?.accepting_points ?? 0 : 0);

  const isLaptop = useMediaQuery({ minWidth: 768 });

  const { data: categories, isFetched } = useCategoryList(boardId, {});

  const creatQuestion = useMutation({
    mutationFn: ({ title, content, acceptPoint }: { title: string; content: string; acceptPoint: number }) => {
      if (title.length > 64) toast.error("제목은 64자 이하로 입력해주세요");
      else if (!title || !content) toast.error("제목 또는 내용은 비울 수 없습니다");

      setDisabled(true);

      return request.post(`/api/boards/${boardId}/categories/${category}/posts/`, {
        title: title,
        content: content,
        question: {
          accepting_points: Number(acceptPoint),
        },
      });
    },
    onSuccess: (data) => {
      if (data.data.status === "success") {
        router.replace(`/questions/${boardId}/categories/${category}/posts/${data.data.data.id}`);
      }
    },
    onError: (err: any) => {
      if (err.response.status == 404) toast.error("카테고리는 비울 수 없습니다");
      else if (err.response.status == 403) toast.error("이 작업을 수행할 권한(permission)이 없습니다.");
      else toast.error(err.response.data.errors[0].detail);

      setDisabled(false);
    },
  });

  const editQuestion = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      request.patch(`/api/boards/${boardId}/categories/${category}/posts/${post?.id}/`, {
        title: title,
        content: content,
      }),
    onSuccess: (response) => {
      router.replace(`/questions/${boardId}/categories/${category}/posts/${response.data.data.id}`);
      toast.success("질문 수정에 성공했습니다.");
    },
    onError: (err) => {
      toast.error("질문 수정에 실패했습니다");
    },
  });

  const handleSubmit = useCallback(() => {
    if (mode === "create") {
      creatQuestion.mutate({ title, content, acceptPoint });
    } else if (mode == "edit") {
      editQuestion.mutate({ title, content });
    }
  }, [mode, title, content, acceptPoint, creatQuestion, editQuestion]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {isFetched && (
          <Select onValueChange={(value) => setCategory(value)} defaultValue={category}>
            <SelectTrigger className="h-12 w-full max-w-2xl bg-white text-sm text-gray-500 shadow-md dark:bg-gray-900 dark:text-gray-400 md:text-base">
              <SelectValue placeholder="세부 카테고리를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category, index) => (
                <SelectItem key={index} value={category.name}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="제목을 입력해주세요"
          className="w-full rounded-lg bg-white p-3 text-sm shadow-md outline-none transition focus:ring-1 focus:ring-ring dark:bg-gray-900 md:text-base"
        />

        <div className="overflow-hidden rounded-lg shadow-md" data-color-mode={theme.theme}>
          <MDEditor
            className="text-base dark:bg-gray-700"
            previewOptions={{
              rehypePlugins: [rehypeSanitize],
              style: { backgroundColor: theme.theme === "dark" ? "#374151" : "#ffffff" },
              components: {
                // @ts-ignore
                code: Code,
              },
            }}
            lang="ko-KR"
            value={content}
            preview={isLaptop ? "live" : "edit"}
            height={700}
            onChange={(value) => {
              setContent(value ?? "");
            }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm text-white shadow-md dark:bg-gray-600"
        >
          <ArrowUturnLeftIcon className="h-4 w-4" />
          <span>취소</span>
        </button>

        {mode === "edit" ? (
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-md dark:bg-gray-500"
            onClick={(e) => handleSubmit()}
            disabled={disabled}
          >
            <PencilIcon className="h-4 w-4" />
            <span>수정</span>
          </button>
        ) : (
          <QuestionWriteButton acceptPoint={acceptPoint} setAcceptPoint={setAcceptPoint} handleSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
};

export default QuestionForm;

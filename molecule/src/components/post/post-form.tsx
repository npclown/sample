"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import request from "@/lib/api/request";
import { Post as PostType } from "@/lib/definitions";
import { useCategoryList } from "@/store/queries/board/category/list";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import rehypeSanitize from "rehype-sanitize";

import Code from "./common-form";

const PostForm = ({ mode, boardId, post }: { mode: "create" | "edit"; boardId: string; post?: PostType }) => {
  const theme = useTheme();
  const router = useRouter();

  const [disabled, setDisabled] = useState<boolean>(false);

  const [category, setCategory] = useState<string>(mode === "edit" ? post?.category.name ?? "" : "");
  const [title, setTitle] = useState<string>(mode === "edit" ? post?.title ?? "" : "");
  const [content, setContent] = useState<string>(mode === "edit" ? post?.content ?? "" : "");

  const isLaptop = useMediaQuery({ minWidth: 768 });

  const { data: categories, isFetched } = useCategoryList(boardId, {});

  const creatPost = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) => {
      if (title.length > 64) toast.error("제목은 64자 이하로 입력해주세요");
      else if (!title || !content) toast.error("제목 또는 내용은 비울 수 없습니다");

      setDisabled(true);

      return request.post(`/api/boards/${boardId}/categories/${category}/posts/`, {
        title: title,
        content: content,
        // liked: true,
        ...{
          question: {
            accepting_points: 100,
          },
        },
      });
    },
    onSuccess: (data) => {
      if (data.data.status === "success") {
        router.replace(`/boards/${boardId}/categories/${category}/posts/${data.data.data.id}`);
      }
    },
    onError: (err: any) => {
      if (err.response.status == 404) toast.error("카테고리는 비울 수 없습니다");
      else if (err.response.status == 403) toast.error("이 작업을 수행할 권한(permission)이 없습니다.");
      else toast.error(err.response.data.errors[0].detail);

      setDisabled(false);
    },
  });

  const editPost = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      request.patch(`/api/boards/${boardId}/categories/${category}/posts/${post?.id}/`, data),
    onSuccess: (response) => {
      router.replace(`/boards/${boardId}/categories/${category}/posts/${response.data.data.id}`);
    },
    onError: (err) => {
      toast.error("게시글 수정에 실패했습니다");
    },
  });

  const handleSubmit = useCallback(() => {
    if (mode === "create") {
      creatPost.mutate({ title, content });
    } else if (mode == "edit") {
      editPost.mutate({ title, content });
    }
  }, [mode, title, content, creatPost, editPost]);

  return (
    <>
      <div className="flex flex-col gap-2 xl:gap-4">
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
            height={isLaptop ? 700 : 400}
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
          <ArrowUturnLeftIcon className="size-4" />
          <span>취소</span>
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-md dark:bg-gray-500"
          onClick={(e) => handleSubmit()}
          disabled={disabled}
        >
          <PencilIcon className="size-4" />
          <span>{mode === "edit" ? "수정" : "작성"}</span>
        </button>
      </div>
    </>
  );
};

export default PostForm;

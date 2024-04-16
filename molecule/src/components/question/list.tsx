"use client";

import Category from "@/components/board/category";
import SortPost from "@/components/board/question/sort";
import { Post, SearchRange } from "@/lib/definitions";
import { usePostList } from "@/store/queries/board/post/list";
import { useBoardStore } from "@/store/stores/use-board-store";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

import Loading from "../common/loading";
import CustomPagination from "../common/pagination";
import { Separator } from "../ui/separator";
import PostRow from "./row";

const PostList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page: number = parseInt(searchParams.get("page") ?? "1");
  const type: SearchRange = (searchParams.get("type") as SearchRange) ?? "all";
  const keyword: string = searchParams.get("keyword") ?? "";
  const category: string = searchParams.get("category") ?? "";
  const sort: string = searchParams.get("sort") ?? "";

  const board = useBoardStore((state) => state.board);
  const { data, isError, isLoading } = usePostList(board?.name ?? "", page, type, keyword, category, sort, "question", {
    enabled: board != null,
  });

  if (isError) {
    toast.error("존재하지 않는 게시판입니다.");
    router.push(`/`);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between text-base text-gray-500">
        <Category />
        <SortPost category={category} />
      </div>
      <div
        className={clsx(
          "flex flex-col items-center",
          isLoading && "min-h-[300px]",
          (data?.posts.length ?? 0) == 0 && "min-h-[300px]",
        )}
      >
        <Separator className="dark:bg-gray-500" />

        {!board || isLoading ? (
          <div className="m-auto">
            <Loading />
          </div>
        ) : (
          data &&
          data.posts?.map((post: Post) => {
            return (
              <Fragment key={post.id}>
                <PostRow post={post} />
                <Separator className="dark:bg-gray-500" />
              </Fragment>
            );
          })
        )}
        {data && (data.posts.length ?? 0) == 0 && (
          <div className="m-auto text-center text-muted-foreground">작성된 질문이 존재하지 않습니다.</div>
        )}
      </div>

      {data && (
        <CustomPagination
          query={keyword ? `type=${type}&keyword=${keyword}` : ""}
          page={page}
          totalCount={data.totalCount}
          limit={15}
        />
      )}
    </div>
  );
};

export default PostList;

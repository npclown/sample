"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePopularPostList } from "@/store/queries/board/post/popular/list";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

import Loading from "../common/loading";

export default function PopularPost() {
  const isMobile = useMediaQuery({ maxDeviceWidth: 767 });

  const { data: popular_posts, isError, isFetched } = usePopularPostList();

  if (isError) return <></>;

  return (
    <div>
      <div className="flex items-center gap-1">
        <h1 className="font-sans text-lg font-bold text-red-400 md:text-xl xl:text-2xl">실시간 급상승 인기글</h1>
      </div>

      <div className="flex w-full items-center gap-10 border-[1px] border-gray-400 p-5 dark:border-gray-500">
        {!isMobile && (
          <>
            <picture>
              <img src="/img/logo.png" className="w-40" alt="popular" />
            </picture>

            <Separator orientation="vertical" className="h-32 bg-gray-600 dark:bg-gray-500" />
          </>
        )}

        {isFetched ? (
          <div className="flex flex-col gap-2 truncate text-sm md:text-base">
            {popular_posts?.slice(0, 5)?.map((popular_post, index) => (
              <Link
                className="flex cursor-pointer gap-1 hover:underline"
                href={`/boards/${popular_post.category.board.name}/categories/${popular_post.category.name}/posts/${popular_post.id}`}
                key={popular_post.id}
              >
                {isMobile && (
                  <Badge className="h-5 w-12 bg-red-400 text-white dark:bg-red-500 dark:text-white">HOT</Badge>
                )}

                <span className="flex-none">[{popular_post.category.board.label}]</span>
                <span className="flex-none text-gray-500 dark:text-gray-400">[{popular_post.category.label}]</span>
                <span className="flex-1 truncate">{popular_post.title}</span>
                <span className="flex-none text-gray-500 dark:text-gray-400">[{popular_post.comment_count}]</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="m-auto">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

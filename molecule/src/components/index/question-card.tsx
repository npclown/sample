"use client";

import { DistanceTime } from "@/components/time";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/user-card";
import { Post } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { usePostList } from "@/store/queries/board/post/list";
import { useAuthUser } from "@/store/stores/use-auth-store";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRef, useState } from "react";

export default function QuestionCard({ className }: { className?: string }) {
  const user = useAuthUser();
  const { data, isError, isLoading } = usePostList(
    "question_tech",
    1,
    "all",
    undefined,
    undefined,
    "not_answered",
    "question",
  );

  const scrollRef = useRef(null);
  const [scrollInterval, setScrollInterval] = useState(null);

  if (isError || isLoading) return <QuestionCardSkeleton />;

  const scroll = (direction: string) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -10 : 10;
      // @ts-ignore
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (direction: string) => {
    // @ts-ignore
    setScrollInterval(setInterval(() => scroll(direction), 50));
  };

  const handleMouseUp = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-lg bg-white shadow-md dark:bg-gray-700 md:items-center",
        className,
      )}
    >
      <h1 className="px-5 pt-4 text-base font-bold text-yellow-500 md:text-xl">답변을 기다리는 질문</h1>

      <Separator className="h-1 bg-yellow-400" />

      <div
        ref={scrollRef}
        className="flex w-full items-center gap-2 overflow-x-scroll py-3 md:gap-4 md:py-12 md:scrollbar-hide"
      >
        {data && (data.posts.length ?? 0) > 3 && (
          <div className="absolute flex w-full items-center justify-between text-gray-300 dark:text-gray-500">
            <ChevronLeftIcon
              className="size-10 cursor-pointer hover:text-gray-200 hover:dark:text-gray-400"
              onMouseDown={() => handleMouseDown("left")}
              onMouseUp={handleMouseUp}
            />
            <ChevronRightIcon
              className="size-10 cursor-pointer hover:text-gray-200 hover:dark:text-gray-400"
              onMouseDown={() => handleMouseDown("right")}
              onMouseUp={handleMouseUp}
            />
          </div>
        )}

        {data?.posts?.map((post: Post, index: number) => (
          <Link
            key={post.id}
            href={`/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}`}
            className="w-80 flex-none cursor-pointer flex-col gap-3 truncate rounded-md border p-4 hover:border-gray-600 hover:dark:border-gray-300"
          >
            <div className="flex flex-col gap-1">
              <h2 className="truncate text-sm md:text-base">{post.title}</h2>

              <span className="truncate text-xs text-gray-600 dark:text-gray-300 md:text-sm">{post.content}</span>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex items-center gap-1 text-xs">
                <DistanceTime time={new Date()} />
                <div className="size-1 rounded-full bg-gray-500"></div>
                <span>답변 {post.comment_count}</span>
              </div>

              <UserCard user={post.user} type="single" />
            </div>
          </Link>
        ))}

        {data && (data.posts.length ?? 0) == 0 && (
          <div className="text-center text-muted-foreground">새로운 질문이 존재하지 않습니다.</div>
        )}
      </div>
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="relative col-span-2 flex flex-col items-center gap-2 rounded-lg bg-white p-5 shadow-md dark:bg-gray-700">
      <Skeleton className="h-5 w-[200px]" />

      <Skeleton className="h-1 w-full" />

      <div className="flex w-full items-center justify-center gap-4 overflow-x-scroll py-12 scrollbar-hide">
        <div className="absolute flex w-full items-center justify-between text-gray-300">
          <Skeleton className="size-10" />
          <Skeleton className="size-10" />
        </div>

        <Separator orientation="vertical" />

        {[...Array(10)].map((_, index) => (
          <div className="flex min-w-[250px] cursor-pointer flex-col gap-3 border-r-gray-500" key={index}>
            <Skeleton className="h-5 w-[100px]" />

            <Skeleton className="h-5 w-[200px]" />

            <div className="flex w-full justify-between">
              <div className="flex gap-1 text-xs">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>

              <Skeleton className="size-7" />
            </div>
          </div>
        ))}

        <Separator orientation="vertical" />
      </div>
    </div>
  );
}

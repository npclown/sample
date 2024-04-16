import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/lib/definitions";
import { usePostList } from "@/store/queries/board/post/list";
import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";

import { MainRow } from "../post/row";

const BoardMainView = ({
  boardName,
  categoryName = "",
  title,
  rank = false,
}: {
  boardName: string;
  categoryName?: string;
  title: string;
  rank: boolean;
}) => {
  const { isLoading, data, isError } = usePostList(boardName, 1, "all", "", categoryName, "", "", {
    enabled: boardName != null,
  });

  if (isLoading || isError) {
    return <BoardMainSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className={clsx("text-base font-bold md:text-xl", rank && "text-red-400", !rank && "text-ionblue-500")}>
              {title}
            </h1>
          </div>

          {!rank && (
            <Link href={categoryName != "" ? `/boards/${boardName}?category=${categoryName}` : `/boards/${boardName}`}>
              <PlusIcon className={clsx("size-7", rank && "text-red-400", !rank && "text-ionblue-500")} />
            </Link>
          )}
        </div>

        <Separator className={clsx("h-1", !rank && "bg-ionblue-400", rank && "bg-red-400")} />
      </div>

      <div className={clsx("flex flex-col gap-1", (data?.posts.length ?? 0) == 0 && "m-auto")}>
        {data &&
          data.posts?.map((post: Post) => {
            return (
              <Fragment key={post.id}>
                <MainRow post={post} rank={rank} />
                <Separator />
              </Fragment>
            );
          })}
        {data && (data.posts.length ?? 0) == 0 && (
          <div className="text-center text-muted-foreground">게시글이 존재하지 않습니다.</div>
        )}
      </div>
    </div>
  );
};

const BoardMainSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-7 w-7" />
        </div>

        <Skeleton className="h-1" />
      </div>

      {[...Array(10)].map((_, index) => (
        <div className="flex flex-col gap-1" key={index}>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-20" />
          </div>

          <Separator />
        </div>
      ))}
    </div>
  );
};

export default BoardMainView;

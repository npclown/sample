import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useIssueList } from "@/store/queries/issues";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const properties = {
  arrows: false,
  transitionDuration: 600,
  easing: "cubic",
  vertical: true,
};

export default function HotIssue({ className, ...props }: { className?: string }) {
  const { data: issues, isError, isFetched } = useIssueList();

  if (isError || !isFetched) return <HotIssueSkeleton />;

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 truncate rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 md:flex-row md:justify-between",
        className,
      )}
      {...props}
    >
      <h1 className="text-base font-bold text-gray-500 dark:text-gray-300 md:text-lg">실시간 이슈</h1>

      {isFetched && (
        <div className="w-full truncate md:mx-auto">
          <Slide {...properties}>
            {issues?.map((issue, index) => (
              <div key={index} className="flex gap-2 text-sm md:items-center md:justify-center md:text-base">
                <Badge className="h-5 w-12 bg-red-400  text-white shadow-none dark:bg-red-500 dark:text-white">
                  HOT
                </Badge>
                <Link
                  href={`/boards/${issue.category.board.name}/categories/${issue.category.name}/posts/${issue.id}`}
                  className="truncate"
                >
                  {issue.category.board.label}게시판 - &quot; <span>{issue.title}</span> &quot;
                </Link>
              </div>
            ))}
          </Slide>
        </div>
      )}
    </div>
  );
}

export function HotIssueSkeleton() {
  return (
    <div className="flex w-full justify-between gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <Skeleton className="h-6 w-20" />

      <div className="flex justify-center gap-2 text-base">
        <Skeleton className="h-6 w-full md:w-[400px]" />
      </div>

      <Skeleton className="size-7" />
    </div>
  );
}

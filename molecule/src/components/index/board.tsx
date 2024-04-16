import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function Board({
  board,
  buttonText,
  children,
}: {
  board: string;
  buttonText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
      <div>
        <h1 className="text-base font-bold text-gray-500">{board}</h1>
      </div>

      <div className="flex flex-col gap-1">{children}</div>

      <Link href={`/boards/${board}`} className="w-full rounded-lg border border-gray-200 py-1 text-xs">
        {buttonText} 확인하기
      </Link>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
      <div>
        <Skeleton className="h-5 w-40" />
      </div>

      {[...Array(10)].map((_, index) => (
        <div className="flex w-full cursor-pointer justify-between rounded-lg px-4 py-2" key={index}>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-12 rounded-lg" />
            <Skeleton className="h-5 w-40 rounded-lg" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-5 w-8 rounded-lg" />
            <Separator orientation="vertical" />
            <Skeleton className="h-5 w-8 rounded-lg" />
          </div>
        </div>
      ))}

      <Skeleton className="h-5 w-full" />
    </div>
  );
}

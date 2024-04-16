import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex justify-between">
          <Skeleton className="size-[40px] rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-[25px] w-[40px] rounded-md" />
            <Skeleton className="h-[25px] w-[40px] rounded-md" />
            <Skeleton className="h-[25px] w-[60px] rounded-md" />
          </div>
        </div>
        <Skeleton className="h-[50px] w-full" />
      </div>
    </div>
  );
};

export default CommentSkeleton;

import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2 font-bold">
          <Skeleton className="h-[28px] w-[82px]" />
          <Skeleton className="h-[28px] w-full" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="size-[40px] rounded-full" />
          <Skeleton className="h-[25px] w-[40px] rounded-md" />
          <Skeleton className="h-[25px] w-[40px] rounded-md" />
          <Skeleton className="h-[25px] w-[60px] rounded-md" />
        </div>
      </div>
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="m-auto h-[42px] w-[72px]" />
    </div>
  );
};

export default PostSkeleton;

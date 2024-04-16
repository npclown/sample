import { Skeleton } from "@/components/ui/skeleton";

import { Separator } from "../ui/separator";

const BoardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white px-12 py-4 shadow-md dark:bg-gray-700">
      <div className="col-start-2 flex flex-col items-center gap-2 rounded-lg">
        <Skeleton className="h-[30px] w-full rounded-md xl:w-[20%]" />
        <Skeleton className="h-[20px] w-[40%] rounded-md" />
      </div>
      <Skeleton className="ml-auto mr-0 h-[20px] w-[120px] rounded-md" />
      <Separator />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
        <Skeleton className="h-[60px] w-full rounded-md" />
      </div>
      <Separator />
      <Skeleton className="mx-auto h-[20px] w-[50%] rounded-md" />
      <Skeleton className="mx-auto h-[30px] w-[70%] rounded-md" />
    </div>
  );
};

export default BoardSkeleton;

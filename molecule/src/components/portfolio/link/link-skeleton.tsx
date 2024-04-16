import { Skeleton } from "@/components/ui/skeleton";

const LinkSkeleton = () => {
  return (
    <div className="space-y-4 border p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold md:text-xl">링크</span>
        </div>
        <Skeleton className="h-3 w-60 md:h-5" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full rounded-md md:h-9" />
        <Skeleton className="h-4 w-full rounded-md md:h-9" />
        <Skeleton className="h-4 w-full rounded-md md:h-9" />
      </div>
    </div>
  );
};

export default LinkSkeleton;

import { Skeleton } from "@/components/ui/skeleton";

const TeamSkeleton = () => {
  return (
    <div className="space-y-4 border p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold md:text-xl">소속</span>
        </div>
        <Skeleton className="h-3 w-60 md:h-5" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-md md:h-9" />
          <Skeleton className="h-4 w-full rounded-md md:h-9" />
          <Skeleton className="h-4 w-full rounded-md md:h-9" />
        </div>
      </div>
    </div>
  );
};

export default TeamSkeleton;

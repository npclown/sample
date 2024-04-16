import { Skeleton } from "@/components/ui/skeleton";

const SkillSkeleton = () => {
  return (
    <div className="space-y-4 border p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold md:text-xl">스킬</span>
        </div>
        <Skeleton className="h-3 w-60 md:h-5" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-4 w-10 rounded-full md:h-10 md:w-24" />
        <Skeleton className="h-4 w-10 rounded-full md:h-10 md:w-24" />
        <Skeleton className="h-4 w-10 rounded-full md:h-10 md:w-24" />
      </div>
    </div>
  );
};

export default SkillSkeleton;

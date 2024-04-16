import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-between space-y-8 p-4 shadow-md md:flex-row md:px-[80px] md:py-[50px] xl:p-[110px]">
      <Skeleton className="size-[120px] rounded-full shadow-md md:size-[140px] xl:size-[180px]" />
      <div className="flex w-full flex-col items-end gap-5 md:w-auto">
        <div className="flex justify-end gap-5">
          <Skeleton className="h-4 w-14 md:h-9" />
          <Skeleton className="h-4 w-14 md:h-9" />
        </div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-6 w-24" />
        <div className="flex justify-end gap-5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-14 w-full md:w-[300px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;

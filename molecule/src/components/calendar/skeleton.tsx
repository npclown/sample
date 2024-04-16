import { Skeleton } from "@/components/ui/skeleton";

const CalendarSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white p-3 shadow-md dark:bg-gray-700 md:px-10 md:py-8 xl:px-32 xl:py-12">
      <Skeleton className="h-[40px] w-full" />

      <div className="flex flex-col gap-5 px-10">
        <Skeleton className="h-[200px] w-full max-w-4xl md:h-[40px] xl:h-[50px]" />

        <Skeleton className="h-[50px] w-full max-w-4xl md:h-[150px] xl:h-[200px]" />

        <div className="flex items-center justify-start">
          <Skeleton className="h-[20px] w-full max-w-sm md:h-[40px] xl:h-[40px]" />
        </div>
      </div>

      <Skeleton className="h-[400px] w-full md:h-[500px] xl:h-[700px]" />
    </div>
  );
};

export default CalendarSkeleton;

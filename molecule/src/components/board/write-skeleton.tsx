import { Skeleton } from "../ui/skeleton";

const BoardWriteSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-[30px] w-full" />
      <Skeleton className="h-[50px] w-full" />
      <Skeleton className="h-[700px] w-full" />
    </div>
  );
};

export default BoardWriteSkeleton;

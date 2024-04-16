import { Skeleton } from "@/components/ui/skeleton";

const AnswerSkeleton = () => {
  return (
    <div className="space-y-2">
      <div>답변</div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};

export default AnswerSkeleton;

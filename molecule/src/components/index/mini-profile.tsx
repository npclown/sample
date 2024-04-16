import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/user-card";
import { User as UserType } from "@/lib/definitions";
import { capitalize, nextLevel, nextLevelPoint } from "@/lib/utils";
import clsx from "clsx";

function ProfileSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center gap-2">
        <Skeleton className="h-[40px] w-[40px] rounded-full" />
        <Skeleton className="h-[20px] w-[80px] rounded-md" />
      </div>

      <Skeleton className="absolute right-4 top-4 h-[26px] w-[78px] rounded-md" />

      <div className="flex flex-col gap-1">
        <Skeleton className="h-[16px] w-[180px] rounded-md" />
        <Skeleton className="h-[16px] w-[256px] rounded-full" />
      </div>

      <div className="flex justify-between font-sans text-xs">
        <Skeleton className="h-[16px] w-[80px] rounded-md" />
        <Skeleton className="h-[16px] w-[80px] rounded-md" />
      </div>
    </div>
  );
}

export default function Profile({ user, shadow = true }: { user: UserType | null; shadow?: boolean }) {
  if (!user) return <ProfileSkeleton />;

  return (
    <div
      className={clsx("relative flex w-full flex-col gap-2 rounded-lg bg-white p-4", {
        "shadow-md": shadow,
      })}
    >
      <div className="flex items-center justify-start">
        <UserCard user={user} />
      </div>

      <button className="absolute right-4 top-4 rounded-md border border-gray-200 px-3 py-1 text-xs transition hover:bg-gray-200">
        마이페이지
      </button>

      <div className="flex flex-col gap-1">
        {user.profile.level !== "novice" && user.profile.level !== "pro" ? (
          <>
            <span className="text-xs font-bold">최고 등급에 도달하였습니다!</span>
            {user.profile.level === "elite" && (
              <Progress className="h-3 shadow-md" progressClassName="bg-emerald-400" value={100} />
            )}
            {user.profile.level === "moderator" && (
              <Progress className="h-3 shadow-md" progressClassName="bg-rose-400" value={100} />
            )}
          </>
        ) : (
          <>
            <span className="text-xs">
              <span
                className={clsx("font-bold", {
                  "text-ionblue-400": user.profile.level === "novice",
                  "text-emerald-400": user.profile.level === "pro",
                })}
              >
                {nextLevel(user.profile.level)}
              </span>
              등급까지 {nextLevelPoint(user.profile.level, user.points.point)?.toLocaleString()} eV 남았습니다.
            </span>

            <Progress
              className="h-3 shadow-md"
              progressClassName={clsx({
                "bg-ionblue-400": user.profile.level === "novice",
                "bg-emerald-400": user.profile.level === "pro",
              })}
              value={(user.points.point / (nextLevelPoint(user.profile.level, user.points.point) ?? 2147483648)) * 100}
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between font-sans text-xs font-bold">
        <Badge variant={`level-${user.profile.level}`}>{capitalize(user.profile.level)}</Badge>
        <span>현재: {user.points.point.toLocaleString()} eV</span>
      </div>
    </div>
  );
}

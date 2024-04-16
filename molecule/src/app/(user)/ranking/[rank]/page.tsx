"use client";

import RankList from "@/components/rank/rank-list";
import TopUserCard from "@/components/rank/top-user-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/user-card";
import { capitalize, cn } from "@/lib/utils";
import { useAttendanceRank } from "@/store/queries/rank/attendances";
import clsx from "clsx";
import { format } from "date-fns";
import React from "react";

export default function Page({ params }: { params: { rank: string } }) {
  const date = format(new Date(), "yyyy-MM-dd");

  const { data: attendances, isError, isFetched } = useAttendanceRank(date);

  if (isError || !isFetched) return <RankSkeleton />;

  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white px-4 py-8 shadow-md dark:bg-gray-700 md:px-20 md:py-12">
      <RankList name={params.rank} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {attendances?.slice(0, 30).map((attendance, index) => (
          <TopUserCard key={`attendance-top-${index}`} rank={index + 1} user={attendance.user}>
            <span className="rounded p-1 font-dseg text-sm font-bold text-red-500 dark:text-red-300 md:text-base xl:text-lg">
              {attendance.attended_time.toString().replaceAll(".", " . ").replaceAll("0", "O")}
            </span>
          </TopUserCard>
        ))}
      </div>

      <div className="flex flex-col items-center rounded-lg">
        {attendances?.map((attendance, index) => {
          // if (index < 30) {
          //   return <></>;
          // }

          return (
            <div className="w-full" key={`attendance-${index}`}>
              <Separator className="h-[1px]" />

              <div
                className={clsx(
                  "flex items-center justify-between p-2 text-xs md:px-10 md:py-3 md:text-base",
                  (index + 1) % 2 == 0 && "bg-gray-100 dark:bg-gray-600",
                )}
              >
                <div className="flex items-center gap-4 md:gap-10">
                  <span>{index + 1}</span>

                  <div className="flex items-center gap-2">
                    <UserCard user={attendance.user} type="profile-image" />
                    <Badge className="hidden md:block" variant={`level-${attendance.user.profile.level}`}>
                      {capitalize(attendance.user.profile.level)}
                    </Badge>
                  </div>
                </div>
                <span className="text-xs md:text-base">{attendance.attended_date as string}</span>
                <span className="text-right text-xs text-gray-600 dark:text-gray-300 md:text-base">
                  {attendance.attended_time as string}
                </span>
              </div>

              <Separator className="h-[1px]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RankSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white px-4 py-8 shadow-md dark:bg-gray-700 md:px-20 md:py-12">
      <Skeleton className="h-10 w-full" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[...Array(12)].map((_, index) => (
          <div key={`attendance-top-${index}`} className="flex items-center justify-between">
            <Skeleton className="h-40 w-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center rounded-lg">
        {[...Array(10)].map((_, index) => (
          <div className="w-full" key={`attendance-${index}`}>
            <Separator className="h-[1px]" />

            <div
              className={clsx(
                "flex items-center justify-between px-10 py-3 text-base",
                (index + 1) % 2 == 0 && "bg-gray-100 dark:bg-gray-600",
              )}
            >
              <div className="flex items-center gap-4 md:gap-10">
                <Skeleton className="size-10" />
                <Skeleton className="size-10" />
              </div>
              <Skeleton className="size-10" />
              <Skeleton className="size-10" />
            </div>

            <Separator className="h-[1px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

"use client";

import { useReports } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

import CommonButton from "../common-button";
import ReportSkeleton from "./report-skeleton";
import ReportView from "./report-view";

const UserReport = ({ portfolioId }: { portfolioId: string }) => {
  const { data: report, isLoading, refetch } = useReports(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && report?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    report && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">취약점 제보</span>
            {owner && report.length != 0 && (
              <CommonButton variant="ghost" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2" asChild>
                <Link href={`/portfolio/${portfolioId}/report/create`}>
                  <PlusIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">
              어떤 취약점을 제보 했는지 알려주세요.
            </div>
          )}
        </div>
        <div className="space-y-3">
          {owner && report.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/report/create`}>
                <PlusIcon className="mr-2 size-4" />
                취약점 제보 이력 추가
              </Link>
            </CommonButton>
          )}
          {report.map((reportInfo: any) => {
            return (
              <ReportView
                key={reportInfo.id}
                portfolioId={portfolioId}
                reportInfo={reportInfo}
                owner={owner}
                refetch={refetch}
              />
            );
          })}
        </div>
      </div>
    )
  );
};

export default UserReport;

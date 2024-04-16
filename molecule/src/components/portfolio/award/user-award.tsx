"use client";

import { useAwards } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

import CommonButton from "../common-button";
import AwardSkeleton from "./award-skeleton";
import AwardView from "./award-view";

const UserAward = ({ portfolioId }: { portfolioId: string }) => {
  const { data: award, isLoading, refetch, isError } = useAwards(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && award?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <AwardSkeleton />;
  }

  return (
    award && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">수 상</span>
            {owner && award.length != 0 && (
              <CommonButton variant="ghost" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2">
                <Link href={`/portfolio/${portfolioId}/award/create`}>
                  <PlusIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">수상 내역을 입력해주세요.</div>
          )}
        </div>
        <div className="space-y-3">
          {owner && award.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/award/create`}>
                <PlusIcon className="mr-2 size-4" />
                수상 추가
              </Link>
            </CommonButton>
          )}
          {award.map((awardInfo: any) => {
            return (
              <AwardView
                key={awardInfo.id}
                portfolioId={portfolioId}
                awardInfo={awardInfo}
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

export default UserAward;

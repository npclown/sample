"use client";

import { useChallenges } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

import CommonButton from "../common-button";
import ChallengeSkeleton from "./challenge-skeleton";
import ChallengeView from "./challenge-view";

const UserChallenge = ({ portfolioId }: { portfolioId: string }) => {
  const { data: challenge, isLoading, refetch } = useChallenges(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && challenge?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <ChallengeSkeleton />;
  }

  return (
    challenge && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">문제 출제</span>
            {owner && challenge.length != 0 && (
              <CommonButton variant="ghost" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2" asChild>
                <Link href={`/portfolio/${portfolioId}/challenge/create`}>
                  <PlusIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">
              이전에 출제하셨던 문제에 대해 알려주세요.
            </div>
          )}
        </div>
        <div className="space-y-3">
          {owner && challenge.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/challenge/create`}>
                <PlusIcon className="mr-2 size-4" />
                문제 출제 이력 추가
              </Link>
            </CommonButton>
          )}
          {challenge.map((challengeInfo: any) => {
            return (
              <ChallengeView
                key={challengeInfo.id}
                portfolioId={portfolioId}
                challengeInfo={challengeInfo}
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

export default UserChallenge;

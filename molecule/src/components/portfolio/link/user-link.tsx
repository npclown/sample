"use client";

import { useLinks } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { LinkIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

import CommonButton from "../common-button";
import LinkSkeleton from "./link-skeleton";

const UserLink = ({ portfolioId }: { portfolioId: string }) => {
  const { data: link, isLoading, refetch } = useLinks(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && link?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <LinkSkeleton />;
  }

  return (
    link && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">링 크</span>
            {owner && link.length != 0 && (
              <CommonButton variant="ghost" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2" asChild>
                <Link href={`/portfolio/${portfolioId}/profile/link/create`}>
                  <PlusIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">
              블로그, SNS등 다양한 링크로 나를 표현해보세요.
            </div>
          )}
        </div>
        <div className="space-y-4">
          {owner && link.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/profile/link/create`}>
                <PlusIcon className="mr-2 size-4" />
                링크 추가
              </Link>
            </CommonButton>
          )}
          {link.map((value: any, index: number) => {
            return (
              <div className="flex items-center" key={value.id}>
                <Link href={value.url} className="flex items-center gap-4">
                  <LinkIcon className="size-4 md:size-6" />
                  <span className="text-sm font-semibold md:text-base">{value.name}</span>
                </Link>
                {owner && (
                  <CommonButton variant="ghost" className="ml-auto mr-0 h-6 px-3 py-2 md:h-9 md:px-4 md:py-2">
                    <Link href={`/portfolio/${portfolioId}/profile/link/${value.id}`}>
                      <PencilIcon className="size-4 md:size-6" />
                    </Link>
                  </CommonButton>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default UserLink;

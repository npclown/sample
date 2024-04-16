"use client";

import { Skill } from "@/lib/definitions";
import { useSkills } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

import CommonBadge from "../common-badge";
import CommonButton from "../common-button";
import SkillSkeleton from "./skill-skeleton";

const UserSkill = ({ portfolioId }: { portfolioId: string }) => {
  const { data: skill, isLoading, refetch } = useSkills(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  const [more, setMore] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && skill?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <SkillSkeleton />;
  }

  return (
    skill && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">스 킬</span>
            {owner && skill.length != 0 && (
              <CommonButton variant="ghost" asChild className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2">
                <Link href={`/portfolio/${portfolioId}/profile/skill`}>
                  <PencilIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">
              최근 경력에서 사용한 스킬을 입력해 보세요.
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {owner && skill.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/profile/skill`}>
                <PlusIcon className="mr-2 size-4" />
                스킬 추가
              </Link>
            </CommonButton>
          )}
          {skill.map((value: Skill, index: number) => {
            if (more || index < 5) {
              return (
                <CommonBadge
                  key={value.id}
                  className={" border-[#E3E8EF] bg-[#F2F5F9] text-[#677489] hover:bg-[#F2F5F9]"}
                >
                  {value.name}
                </CommonBadge>
              );
            }
          })}

          {!more && skill.length - 5 > 0 && (
            <CommonBadge
              className={"cursor-pointer border-[#E3E8EF] bg-[#ffffff] text-[#677489] hover:bg-[#ffffff]"}
              onClick={() => setMore(true)}
            >
              + {skill.length - 5}
            </CommonBadge>
          )}
        </div>
      </div>
    )
  );
};

export default UserSkill;

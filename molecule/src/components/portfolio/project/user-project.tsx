"use client";

import { useProjects } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import CommonButton from "../common-button";
import ProjectDetailView from "./project-detail-view";
import ProjectSkeloton from "./project-skeleton";
import ProjectView from "./project-view";

const UserProject = ({ portfolioId }: { portfolioId: string }) => {
  const { data: project, isLoading, refetch } = useProjects(portfolioId);
  const user = useAuthStore((state) => state.user);
  const owner = decodeURI(portfolioId) === user?.profile?.profile_url;

  const [detail, setDetail] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!owner && project?.length == 0) {
    return <></>;
  }

  if (isLoading) {
    return <ProjectSkeloton />;
  }

  return (
    project && (
      <div className="space-y-4 p-4 shadow-md md:space-y-5 md:px-[80px] md:py-[50px] xl:px-[110px]">
        <div className="md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:text-xl">프로젝트</span>
            {owner && project.length != 0 && (
              <CommonButton variant="ghost" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2" asChild>
                <Link href={`/portfolio/${portfolioId}/project/create`}>
                  <PlusIcon className="size-4 md:size-6" />
                </Link>
              </CommonButton>
            )}
          </div>
          {owner && (
            <div className="pr-8 text-xs text-[#4A5567] dark:text-gray-300 md:text-sm">프로젝트를 입력해주세요.</div>
          )}
        </div>
        {project.length > 0 && (
          <div className="flex items-center gap-2">
            <Label className="text-xs md:text-sm">Detail</Label>
            <Switch defaultChecked={detail} onCheckedChange={(checked) => setDetail(checked)} />
          </div>
        )}
        <div className={detail ? "grid grid-cols-1 gap-1 md:grid-cols-2" : "space-y-3"}>
          {owner && project.length == 0 && (
            <CommonButton
              className="rounded-full border-[#000000] text-xs font-semibold md:text-sm"
              variant="outline"
              asChild
            >
              <Link href={`/portfolio/${portfolioId}/project/create`}>
                <PlusIcon className="mr-2 size-4" />
                프로젝트 추가
              </Link>
            </CommonButton>
          )}
          {project.map((projectInfo: any) => {
            if (detail) {
              return (
                <ProjectDetailView
                  key={projectInfo.id}
                  portfolioId={portfolioId}
                  projectInfo={projectInfo}
                  owner={owner}
                  refetch={refetch}
                />
              );
            }
            return (
              <ProjectView
                key={projectInfo.id}
                portfolioId={portfolioId}
                projectInfo={projectInfo}
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

export default UserProject;

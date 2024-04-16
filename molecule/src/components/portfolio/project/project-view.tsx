import request from "@/lib/api/request";
import { formatDateYM } from "@/lib/utils";
import { FireIcon, LinkIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface ProjectInfoType {
  id: string;
  // 프로젝트 명
  title: string;
  // 프로젝트 성과
  achievement: string;
  //주관사
  start_date: string;
  end_date: string;
  // 역할 (팀)
  position?: string;
  is_team: boolean;
  is_hidden: boolean;
  // 기여한 부분 설명
  contribution?: string;
  description?: string;
  links?: {
    link: string;
    github: string;
  };
}

const ProjectView = ({
  portfolioId,
  projectInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  projectInfo: ProjectInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const pRef1 = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);
  const [more1, setMore1] = useState<boolean>(false);

  const viewEducation = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/projects/${projectInfo.id}/`, { is_hidden });
    },
    onSuccess: (data, variables, context) => {
      if (variables) {
        toast.success("보기로 전환했습니다.");
      } else {
        toast.success("숨기기로 전환했습니다.");
      }
      refetch();
    },
    onError: (error, variables, context) => {},
  });

  const handleEdit = () => {
    router.push(`/portfolio/${portfolioId}/project/${projectInfo.id}`);
  };

  useEffect(() => {
    if (pRef.current) {
      if (pRef.current.scrollHeight > pRef.current.clientHeight) {
        setMore(false);
      } else {
        setMore(true);
      }
    }
  }, []);

  useEffect(() => {
    if (pRef1.current) {
      if (pRef1.current.scrollHeight > pRef1.current.clientHeight) {
        setMore1(false);
      } else {
        setMore1(true);
      }
    }
  }, []);

  return (
    <CommonTimeline
      owner={owner}
      hidden={projectInfo.is_hidden}
      handleView={() => viewEducation.mutate(!projectInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <FireIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {projectInfo.title}
          </div>
          <div className="text-xs text-[#677489] dark:text-gray-400 md:text-sm">
            {formatDateYM(projectInfo.start_date)} ~ {formatDateYM(projectInfo.end_date)}
          </div>
        </div>
        <div className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{projectInfo.achievement}</div>
        {projectInfo.is_team && projectInfo.position && (
          <div className="flex gap-2 text-xs text-[#364154] dark:text-gray-400 md:text-sm">
            <UserGroupIcon className="size-4 text-[#0F172A] dark:text-gray-400 md:size-5" />
            <span>{projectInfo.position}</span>
          </div>
        )}
        {projectInfo.contribution && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {projectInfo.contribution.split("\n").map((line: string, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </p>
        )}
        {!more && (
          <button
            className="ml-auto mr-0 block cursor-pointer text-xs dark:text-gray-400 md:text-sm"
            onClick={(e) => setMore(true)}
          >
            더보기
          </button>
        )}
        {projectInfo.description && (
          <p
            ref={pRef1}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more1 ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {projectInfo.description.split("\n").map((line: string, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </p>
        )}
        {!more1 && (
          <button
            className="ml-auto mr-0 block cursor-pointer text-xs dark:text-gray-400 md:text-sm"
            onClick={(e) => setMore(true)}
          >
            더보기
          </button>
        )}
        {projectInfo.links?.link && (
          <Link href={projectInfo.links?.link} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
        {projectInfo.links?.github && (
          <Link href={projectInfo.links?.github} className="flex items-center gap-2">
            <Image src={"/icon/github.svg"} width={16} height={16} alt="github icon" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">깃허브</span>
          </Link>
        )}
      </CommonTimelineContent>
    </CommonTimeline>
  );
};

export default ProjectView;

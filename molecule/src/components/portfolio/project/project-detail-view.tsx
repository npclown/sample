import request from "@/lib/api/request";
import { formatDateYM } from "@/lib/utils";
import { EyeIcon, EyeSlashIcon, LinkIcon, PencilIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import CommonButton from "../common-button";

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

const ProjectDetailView = ({
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
    <div className="relative space-y-3 rounded-md border px-5 py-4">
      <div className="flex items-center">
        <div className="flex flex-wrap items-center pr-[80px]">
          <div className="mr-2 text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base ">
            {projectInfo.title}
          </div>
          <div className="text-xs text-[#677489] md:text-sm">
            {formatDateYM(projectInfo.start_date)} ~ {formatDateYM(projectInfo.end_date)}
          </div>
        </div>
        {owner && (
          <div className="absolute right-0 top-4">
            <CommonButton
              variant="ghost"
              className="ml-auto mr-0 h-5 px-3 py-2 md:h-9 md:px-4 md:py-2"
              onClick={() => viewEducation.mutate(!projectInfo.is_hidden)}
            >
              {projectInfo.is_hidden ? (
                <EyeSlashIcon className="size-4 md:size-6" />
              ) : (
                <EyeIcon className="size-4 md:size-6" />
              )}
            </CommonButton>
            <CommonButton variant="ghost" className="mr-0 h-5 px-3 py-2 md:h-9 md:px-4 md:py-2" onClick={handleEdit}>
              <PencilIcon className="size-4 md:size-6" />
            </CommonButton>
          </div>
        )}
      </div>
      <div className="text-xs text-[#364154] dark:text-gray-400 md:text-sm ">{projectInfo?.description}</div>
      {projectInfo.is_team && projectInfo.position && (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#364154] dark:text-gray-400 md:text-base ">팀 구성</div>
          <div className="flex items-center gap-2 text-xs text-[#364154] dark:text-gray-400 md:text-sm ">
            <UserGroupIcon className="size-4 text-[#0F172A] dark:text-gray-400 md:size-5 " />
            <span>{projectInfo.position}</span>
          </div>
        </div>
      )}
      {projectInfo.achievement && (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#364154] dark:text-gray-400 md:text-base ">
            어떤 성과를 얻었나요?
          </div>
          <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm ">{projectInfo.achievement}</p>
        </div>
      )}
      {projectInfo.contribution && (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#364154] dark:text-gray-400 md:text-base ">기여</div>
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
        </div>
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
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#364154] dark:text-gray-400 md:text-base ">프로젝트 설명</div>
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
        </div>
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
          <LinkIcon className="size-4 text-[#364154] dark:text-gray-400 " />
          <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm ">링크 이동</span>
        </Link>
      )}
      {projectInfo.links?.github && (
        <Link href={projectInfo.links?.github} className="flex items-center gap-2">
          <Image src={"/icon/github.svg"} width={16} height={16} alt="github icon" />
          <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm ">깃허브</span>
        </Link>
      )}
    </div>
  );
};

export default ProjectDetailView;

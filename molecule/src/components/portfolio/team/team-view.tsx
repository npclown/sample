import request from "@/lib/api/request";
import { Skill } from "@/lib/definitions";
import { formatDateYM } from "@/lib/utils";
import { HomeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface TeamInfoType {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  skills?: Skill[];
  is_current: boolean;
  is_hidden: boolean;
  description?: string;
  type: string;
  links?: {
    link: string;
  };
}

const TeamView = ({
  portfolioId,
  teamInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  teamInfo: TeamInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  const viewWork = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/experiences/${teamInfo.id}/`, { is_hidden });
    },
    onSuccess: (data, variables, context) => {
      if (variables) {
        toast.success("보기로 전환했습니다.");
      } else {
        toast.success("숨기기로 전환했습니다.");
      }
      refetch();
    },
  });

  const handleEdit = () => {
    router.push(`/portfolio/${portfolioId}/experience/team/${teamInfo.id}`);
  };

  const skillList = teamInfo?.skills?.map((value: Skill) => value.name);

  useEffect(() => {
    if (pRef.current) {
      if (pRef.current.scrollHeight > pRef.current.clientHeight) {
        setMore(false);
      } else {
        setMore(true);
      }
    }
  }, []);

  return (
    <CommonTimeline
      owner={owner}
      hidden={teamInfo.is_hidden}
      handleView={() => viewWork.mutate(!teamInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <HomeIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {teamInfo.company} - {teamInfo.position}
          </div>
          <div className="text-xs text-[#677489] dark:text-gray-400 md:text-sm">
            {formatDateYM(teamInfo.start_date)} ~ {teamInfo.is_current ? "현재" : formatDateYM(teamInfo.end_date)}
          </div>
        </div>
        {teamInfo.skills && teamInfo.skills.length > 0 && (
          <div className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">스킬 : {skillList?.join(", ")}</div>
        )}
        {teamInfo.description && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {teamInfo.description.split("\n").map((line: string, index) => (
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
        {teamInfo.links?.link && (
          <Link href={teamInfo.links.link} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
      </CommonTimelineContent>
    </CommonTimeline>
  );
};

export default TeamView;

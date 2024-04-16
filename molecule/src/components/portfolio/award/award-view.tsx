import request from "@/lib/api/request";
import { formatDateYM } from "@/lib/utils";
import { LinkIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface AwardInfoType {
  id: string;
  agency: string;
  event: string;
  title: string;
  medal: string;
  start_date: string;
  end_date: string;
  position: string;
  is_team: boolean;
  description?: string;
  is_hidden: boolean;
  links?: {
    link: string;
  };
}

const AwardView = ({
  portfolioId,
  awardInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  awardInfo: AwardInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  const viewEducation = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/awards/${awardInfo.id}/`, { is_hidden });
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
    router.push(`/portfolio/${portfolioId}/award/${awardInfo.id}`);
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

  return (
    <CommonTimeline
      owner={owner}
      hidden={awardInfo.is_hidden}
      handleView={() => viewEducation.mutate(!awardInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <TrophyIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {awardInfo.event} - {awardInfo.title}
          </div>
          <div className="text-xs text-[#677489] dark:text-gray-400 md:text-sm">
            {formatDateYM(awardInfo.start_date)} ~ {formatDateYM(awardInfo.end_date)}
          </div>
        </div>
        <div className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{awardInfo.agency}</div>
        {awardInfo.is_team && awardInfo.position && (
          <div className="flex gap-2 text-xs text-[#364154] dark:text-gray-400 md:text-sm ">
            <UserGroupIcon className="size-4 text-[#0F172A] dark:text-gray-400 md:size-5 " />
            <span>{awardInfo.position}</span>
          </div>
        )}
        {awardInfo.description && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {awardInfo.description.split("\n").map((line: string, index) => (
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
        {awardInfo.links?.link && (
          <Link href={awardInfo.links?.link} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400 " />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
      </CommonTimelineContent>
    </CommonTimeline>
  );
};

export default AwardView;

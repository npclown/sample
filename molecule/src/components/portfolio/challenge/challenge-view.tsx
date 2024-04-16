import request from "@/lib/api/request";
import { LinkIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface ChallengeInfoType {
  id: string;
  title: string;
  type: string;
  event: string;
  difficulty: string;
  keyword: string;
  is_hidden: boolean;
  description?: string;
  links?: {
    write: string;
    link: string;
  };
}

const ChallengeView = ({
  portfolioId,
  challengeInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  challengeInfo: ChallengeInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  const viewEducation = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/challenges/${challengeInfo.id}/`, { is_hidden });
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
    router.push(`/portfolio/${portfolioId}/challenge/${challengeInfo.id}`);
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
      hidden={challengeInfo.is_hidden}
      handleView={() => viewEducation.mutate(!challengeInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <WrenchIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {challengeInfo.title} - {challengeInfo.type}
          </div>
        </div>
        {challengeInfo.event && (
          <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{challengeInfo.event}</p>
        )}
        {challengeInfo.difficulty && (
          <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{challengeInfo.difficulty}</p>
        )}
        {challengeInfo.keyword && (
          <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{challengeInfo.keyword}</p>
        )}
        {challengeInfo.description && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {challengeInfo.description}
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
        {challengeInfo.links?.link && (
          <Link href={challengeInfo.links?.link} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
        {challengeInfo.links?.write && (
          <Link href={challengeInfo.links?.write} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              문제 다운로드
            </span>
          </Link>
        )}
      </CommonTimelineContent>
    </CommonTimeline>
  );
};

export default ChallengeView;

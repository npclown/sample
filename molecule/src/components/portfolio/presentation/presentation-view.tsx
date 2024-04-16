import request from "@/lib/api/request";
import { DocumentArrowDownIcon, PresentationChartBarIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface PresentationInfoType {
  id: string;
  // 세미나
  event: string;
  // 발표 주최
  agency: string;
  // 발표 주제
  title: string;
  date: string;
  location: string;
  is_hidden: boolean;
  // 역할
  description?: string;
  links?: {
    link: string;
    youtube: string;
  };
}

const PresentationView = ({
  portfolioId,
  presentationInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  presentationInfo: PresentationInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  const viewPresentation = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/presentations/${presentationInfo.id}/`, { is_hidden });
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
    router.push(`/portfolio/${portfolioId}/presentation/${presentationInfo.id}`);
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
      hidden={presentationInfo.is_hidden}
      handleView={() => viewPresentation.mutate(!presentationInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <PresentationChartBarIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {presentationInfo.agency} - {presentationInfo.title}
          </div>
          <div className="text-xs text-[#677489] dark:text-gray-400 md:text-sm">{presentationInfo.date}</div>
        </div>
        <div className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{presentationInfo.event}</div>
        {presentationInfo.description && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {presentationInfo.description.split("\n").map((line: string, index) => (
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
        {presentationInfo.links?.link && (
          <Link href={presentationInfo.links?.link} className="flex gap-2">
            <DocumentArrowDownIcon className="size-4 text-[#364154] dark:text-gray-400 " />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              발표 자료
            </span>
          </Link>
        )}
        {presentationInfo.links?.youtube && (
          <Link href={presentationInfo.links?.youtube} className="flex gap-2">
            <VideoCameraIcon className="size-4 text-[#364154] dark:text-gray-400 " />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              발표 영상
            </span>
          </Link>
        )}
      </CommonTimelineContent>
    </CommonTimeline>
  );
};

export default PresentationView;

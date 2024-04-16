import request from "@/lib/api/request";
import { AcademicCapIcon, LinkIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CommonTimeline, CommonTimelineContent, CommonTimelineIcon } from "../common-timeline";

interface ReportInfoType {
  id: string;
  agency: string;
  vendor: string;
  issue_id: string;
  cvss: string;
  date: string;
  is_hidden: boolean;
  short_description?: string;
  description?: string;
  links?: {
    cve: string;
    vendor_link: string;
    link: string;
  };
}

const ReportView = ({
  portfolioId,
  reportInfo,
  owner,
  refetch,
}: {
  portfolioId: string;
  reportInfo: ReportInfoType;
  owner: boolean;
  refetch: Function;
}) => {
  const router = useRouter();
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  const viewEducation = useMutation({
    mutationFn: async (is_hidden: boolean) => {
      return await request.patch(`/api/user/portfolio/bounties/${reportInfo.id}/`, { is_hidden });
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
    router.push(`/portfolio/${portfolioId}/report/${reportInfo.id}`);
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
      hidden={reportInfo.is_hidden}
      handleView={() => viewEducation.mutate(!reportInfo.is_hidden)}
      handleEdit={handleEdit}
    >
      <CommonTimelineIcon>
        <WrenchIcon className="size-4 md:size-6" />
      </CommonTimelineIcon>
      <CommonTimelineContent>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#101729] dark:text-gray-300 md:text-base">
            {reportInfo.agency} - {reportInfo.vendor}
          </div>
          <div className="text-xs text-[#677489] dark:text-gray-400 md:text-sm">{reportInfo.date}</div>
        </div>
        {reportInfo.issue_id && (
          <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{reportInfo.issue_id}</p>
        )}
        {reportInfo.cvss && <p className="text-xs text-[#364154] dark:text-gray-400 md:text-sm">{reportInfo.cvss}</p>}
        {reportInfo.short_description && (
          <p className="break-all text-xs text-[#364154] dark:text-gray-400 md:text-sm">
            {reportInfo.short_description}
          </p>
        )}
        {reportInfo.description && (
          <p
            ref={pRef}
            className={clsx(
              "text-xs text-[#364154] dark:text-gray-400 md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {reportInfo.description.split("\n").map((line: string, index) => (
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
        {reportInfo.links?.cve && (
          <Link href={reportInfo.links?.cve} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
        {reportInfo.links?.vendor_link && (
          <Link href={reportInfo.links?.vendor_link} className="flex gap-2">
            <LinkIcon className="size-4 text-[#364154] dark:text-gray-400" />
            <span className="text-xs text-[#364154] underline-offset-auto dark:text-gray-400 md:text-sm">
              링크 이동
            </span>
          </Link>
        )}
        {reportInfo.links?.link && (
          <Link href={reportInfo.links?.link} className="flex gap-2">
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

export default ReportView;

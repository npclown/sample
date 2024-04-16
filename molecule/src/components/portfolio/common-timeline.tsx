"use client";

import { EyeIcon, EyeSlashIcon, PencilIcon } from "@heroicons/react/24/outline";

import { Separator } from "../ui/separator";
import CommonButton from "./common-button";

const CommonTimelineIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mr-4 flex flex-col items-center gap-2 pt-[2px]">
      {children}
      <Separator orientation={"vertical"} className="flex-1 bg-[#000000]" />
    </div>
  );
};

const CommonTimelineContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-1 flex-col gap-4">{children}</div>;
};

const CommonTimeline = ({
  owner = false,
  hidden,
  handleView,
  handleEdit,
  children,
}: {
  owner?: boolean;
  hidden?: boolean;
  handleView?: () => void;
  handleEdit?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex">
      {children}
      {owner && (
        <>
          <CommonButton
            variant="ghost"
            className="ml-auto mr-0 h-5 px-3 py-2 md:h-9 md:px-4 md:py-2"
            onClick={handleView}
          >
            {hidden ? <EyeSlashIcon className="size-4 md:size-6" /> : <EyeIcon className="size-4 md:size-6" />}
          </CommonButton>
          <CommonButton variant="ghost" className="mr-0 h-5 px-3 py-2 md:h-9 md:px-4 md:py-2" onClick={handleEdit}>
            <PencilIcon className="size-4 md:size-6" />
          </CommonButton>
        </>
      )}
    </div>
  );
};

export { CommonTimeline, CommonTimelineIcon, CommonTimelineContent };

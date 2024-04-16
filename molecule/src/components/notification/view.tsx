import { cn } from "@/lib/utils";

import { DistanceTime } from "../time";
import NotificationBadge from "./badge";

const NotificationView = ({
  title,
  desc,
  time,
  read,
  type,
}: {
  title: string;
  desc: string;
  time: string | Date;
  read: boolean;
  type?: "type1" | "type2" | "type3";
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border p-4 group-focus-visible:bg-gray-100 dark:group-focus-visible:bg-gray-600",
        {
          "bg-gray-100 dark:bg-gray-600": read,
          "opacity-50": read,
        },
      )}
    >
      <div className="size-[48px] flex-none rounded-full bg-ionblue-500"></div>
      <div className="flex flex-col justify-between gap-2">
        <div className="text-sm font-semibold md:text-base">{title}</div>
        <div className="break-words text-xs font-medium md:text-sm">{desc}</div>
        <DistanceTime time={time} className="text-xs font-normal md:text-sm" />
      </div>
      {type && (
        <div className="ml-auto mr-0">
          <NotificationBadge type={type} />
        </div>
      )}
    </div>
  );
};

export default NotificationView;

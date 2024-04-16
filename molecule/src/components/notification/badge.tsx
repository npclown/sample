import { Badge } from "../ui/badge";

// TODO :: 실제 타입이 정해지면 거기 맞게 셋팅 필요

const NotificationBadgeType = {
  type1: {
    className:
      "border-transparent bg-[#CCE0FF] text-gray-90 shadow hover:bg-[#CCE0FF]/80 dark:bg-gray-50 dark:text-[#CCE0FF] dark:hover:bg-gray-50/80",
    value: "답변",
  },
  type2: {
    className:
      "border-transparent bg-[#D0FFEE] text-gray-90 shadow hover:bg-[#D0FFEE]/80 dark:bg-gray-50 dark:text-[#D0FFEE] dark:hover:bg-gray-50/80",
    value: "채택",
  },
  type3: {
    className:
      "border-transparent bg-[#FFCBD4] text-gray-90 shadow hover:bg-[#FFCBD4]/80 dark:bg-gray-50 dark:text-[#FFCBD4] dark:hover:bg-gray-50/80",
    value: "Moderator",
  },
};

const NotificationBadge = ({ type }: { type: "type1" | "type2" | "type3" }) => {
  const current = type ? NotificationBadgeType[type] : NotificationBadgeType["type1"];

  return <Badge className={current.className}>{current.value}</Badge>;
};

export default NotificationBadge;

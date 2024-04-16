import request from "@/lib/api/request";
import { Notification } from "@/lib/definitions";
import { useNotificationList } from "@/store/queries/notification";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

import Loading from "../common/loading";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SwitchRect } from "../ui/switch";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import NotificationView from "./view";

const NotificationList = () => {
  // Type에 따른 API 명세서가 필요함
  const { data: notifications, isLoading, refetch } = useNotificationList();
  const [type, setType] = useState<string>("all");
  const [read, setRead] = useState<boolean>(false);

  const readNoti = useMutation({
    mutationFn: (id: string) => {
      return request.post(`/api/notifications/${id}/read/`);
    },
    onSuccess: (data, variables, context) => {
      refetch();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  const filterNotificatoins = notifications?.filter((notification) => {
    if (read) {
      return notification.read_at === null;
    }

    return true;
  });

  const handleTypeChange = (value: string) => {
    if (value === "") {
      setType("all");
    } else {
      setType(value);
    }
  };

  useLayoutEffect(() => {
    refetch();
  }, [type, refetch]);

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
        <ToggleGroup type="single" variant="outline" defaultValue={"all"} value={type} onValueChange={handleTypeChange}>
          <ToggleGroupItem
            className="bg-[#D1D5DB80] text-sm hover:bg-[#D1D5DB] data-[state=on]:bg-[#D1D5DB] dark:bg-[#9ca4b080] dark:hover:bg-[#b3b9c4] dark:data-[state=on]:bg-[#b3b9c4] md:text-base"
            value="all"
          >
            전체
          </ToggleGroupItem>
          <ToggleGroupItem
            className="bg-[#CCE0FF80] text-sm hover:bg-[#CCE0FF] data-[state=on]:bg-[#CCE0FF] dark:hover:bg-[#abbfdd] dark:data-[state=on]:bg-[#abbfdd] md:text-base"
            value="type1"
          >
            QnA
          </ToggleGroupItem>
          <ToggleGroupItem
            className="bg-[#D0FFEE80] text-sm hover:bg-[#D0FFEE] data-[state=on]:bg-[#D0FFEE] dark:hover:bg-[#9dc9b9] dark:data-[state=on]:bg-[#9dc9b9] md:text-base"
            value="type2"
          >
            댓글
          </ToggleGroupItem>
          <ToggleGroupItem
            className="bg-[#fFCBD480] text-sm hover:bg-[#FFCBD4] data-[state=on]:bg-[#FFCBD4] dark:bg-[#eb899a80] dark:hover:bg-[#c99da4] dark:data-[state=on]:bg-[#c99da4] md:text-base"
            value="type3"
          >
            채택
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center space-x-2">
          <Label htmlFor="read-mode" className="text-sm md:text-base">
            읽지 않은 알림
          </Label>
          <SwitchRect
            id="read-mode"
            className="data-[state=checked]:bg-ionblue-500 dark:data-[state=checked]:bg-ionblue-500 dark:data-[state=unchecked]:bg-gray-400"
            defaultChecked={read}
            onCheckedChange={(checked) => setRead(checked)}
          />
        </div>
      </div>
      <Separator />
      {isLoading ? (
        <Loading />
      ) : filterNotificatoins?.length == 0 ? (
        <div className="flex h-[400px] items-center justify-center text-base font-bold dark:text-gray-300 md:text-lg">
          새로운 알림이 없습니다.
        </div>
      ) : (
        <ScrollArea>
          {filterNotificatoins &&
            filterNotificatoins.map((notification: Notification) => {
              return (
                <Link
                  href={notification.link}
                  className="group focus-visible:outline-none"
                  onClick={() => readNoti.mutate(notification.id)}
                  key={notification.id}
                >
                  <NotificationView
                    title={notification.label}
                    desc={notification.content}
                    time={notification.created_at}
                    read={notification.read_at !== null}
                  />
                </Link>
              );
            })}
        </ScrollArea>
      )}
    </>
  );
};

export default NotificationList;

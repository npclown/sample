import request from "@/lib/api/request";
import { Notification } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { useNotificationList } from "@/store/queries/notification";
import { BellAlertIcon, BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { DropdownMenuItem, DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button, buttonVariants } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import NotificationView from "./view";

const NofiticationDialog = () => {
  const { data: notifications, isLoading, refetch } = useNotificationList();

  // 읽지 않은 알람 개수
  const filterNotificatoins = notifications?.filter((notification) => {
    return notification.read_at === null;
  });

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

  // TODO:: 모두 읽음 API에 대해서 생각해보기
  const readAll = useMutation({
    mutationFn: () => {
      return request.post(`/api/notifications/read_all/`);
    },
    onSuccess: (data, variables, context) => {
      refetch();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto mr-0 p-2 outline-none">
        {filterNotificatoins?.length == 0 ? (
          <BellIcon className="size-7 text-gray-700 dark:text-gray-400" />
        ) : (
          <BellAlertIcon className="size-7 text-gray-700 dark:text-gray-400" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-[350px] p-0 md:mr-20">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between border p-4">
            <div className="text-xl font-bold">알림 내역</div>
            <Button variant="outline" className="text-sm" onClick={(e) => readAll.mutate()}>
              <CheckIcon className="mr-2 size-4" />
              모두 읽음 처리
            </Button>
          </div>
        </DropdownMenuLabel>
        <ScrollArea className="h-[318px] w-full">
          {notifications &&
            notifications.map((notification: Notification) => {
              return (
                <DropdownMenuItem asChild key={notification.id}>
                  <Link
                    href={notification.link}
                    className="group focus-visible:outline-none"
                    onClick={() => readNoti.mutate(notification.id)}
                  >
                    <NotificationView
                      title={notification.label}
                      desc={notification.content}
                      time={notification.created_at}
                      read={notification.read_at !== null}
                    />
                  </Link>
                </DropdownMenuItem>
              );
            })}
        </ScrollArea>
        <DropdownMenuItem asChild>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "focus-visible:outline-none",
              "mx-auto my-4 block w-[94px]",
            )}
            href="/user/notification"
          >
            전체 보기
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NofiticationDialog;

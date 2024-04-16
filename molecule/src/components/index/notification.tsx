import { DistanceTime } from "@/components/time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import request from "@/lib/api/request";
import { useNotificationList } from "@/store/queries/notification";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx";
import Link from "next/link";
import { toast } from "react-toastify";

function NotificationRowSkeleton() {
  return (
    <div className="relative border-b border-gray-200 p-2">
      <Skeleton className="mb-1 h-[20px] w-[64px] rounded-md" />
      <Skeleton className="absolute right-2 top-2 h-[14px] w-[54px] rounded-md" />

      <Skeleton className="h-[16px] w-[240px] rounded-md" />
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex w-72 flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-[24px] w-[60px] rounded-md" />
        <Skeleton className="h-[24px] w-[136px] rounded-md" />
      </div>

      <div className="flex flex-col gap-1 border-y border-gray-200">
        <ScrollArea className="h-[420px] w-full">
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
        </ScrollArea>
      </div>
    </div>
  );
}
export default function Notification() {
  const { data: notifications, isLoading } = useNotificationList();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return request.post(`/api/notifications/${id}/read/`);
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  if (!notifications) return <NotificationSkeleton />;

  return (
    <div className="flex w-72 flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex w-full justify-between">
        <h1 className="text-base font-bold text-gray-500">알림 내역</h1>

        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 text-xs transition hover:bg-gray-200">
          <CheckIcon className="h-4 w-4" />
          <span>모두 읽음으로 표시</span>
        </button>
      </div>

      <div className="w-full border-y border-gray-200">
        <ScrollArea className="h-[420px] w-full">
          {notifications.map((notification) => {
            return (
              <Link href={notification.link} key={notification.id} onClick={() => mutation.mutate(notification.id)}>
                <Alert
                  className={clsx("transition hover:bg-gray-200", {
                    "text-gray-400": notification.read_at,
                  })}
                >
                  <AlertTitle className="text-sm">{notification.label}</AlertTitle>
                  <AlertDescription className="text-xs">{notification.content}</AlertDescription>
                  <DistanceTime
                    time={notification.created_at}
                    className="absolute right-2 top-2 text-xs text-gray-400"
                  />
                </Alert>
              </Link>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
}

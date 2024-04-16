import request from "@/lib/api/request";
import { Notification } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const notificationQueryKey = createQueryKeys("notification", {
  list: () => ["list"],
});

const getNotificationList = async () => {
  try {
    const { data } = await request.get<{ data: Notification[] }>("/api/notifications/");
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useNotificationList = () =>
  useQuery({
    queryKey: notificationQueryKey.list().queryKey,
    queryFn: getNotificationList,
    refetchInterval: 1000 * 60,
  });

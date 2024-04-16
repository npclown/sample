import request from "@/lib/api/request";
import { Calendar } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const calendarQueryKey = createQueryKeys("calendars", {
  calendars: () => ["calendars"],
});

const getCalendarList = async () => {
  try {
    const { data } = await request.get<{ data: Calendar[] }>("/api/calendars/");

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useCalendarList = () =>
  useQuery({
    queryKey: calendarQueryKey.calendars().queryKey,
    queryFn: () => getCalendarList(),
  });

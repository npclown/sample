import { Calendar } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const calendarQueryKey = createQueryKeys("calendars", {
  calendars: (page) => ["calendars", page],
});

const getCalendarList = async (page: number) => {
  try {
    const { data } = await request.get<Pagination<Calendar>>("/api/admin/calendars/", {
      params: { page },
    });

    return data;
  } catch (err) {
    throw err;
  }
};

export const useCalendarList = (page: number) =>
  useQuery({
    queryKey: calendarQueryKey.calendars(page).queryKey,
    queryFn: () => getCalendarList(page),
  });

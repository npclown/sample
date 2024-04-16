import request from "@/lib/api/request";
import { Calendar } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const calendarQueryKey = createQueryKeys("calendar", {
  calendars: (name) => ["calendar", name],
});

const getCalendar = async (name: string) => {
  try {
    const { data } = await request.get<{ data: Calendar }>(`/api/calendars/${name}/`);

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useCalendar = (name: string) =>
  useQuery({
    queryKey: calendarQueryKey.calendars(name).queryKey,
    queryFn: () => getCalendar(name),
  });

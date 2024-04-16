import { Event } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const eventQueryKey = createQueryKeys("events", {
  events: (name) => ["events", name],
});

const getEventList = async (name: string) => {
  try {
    const { data } = await request.get<Pagination<Event>>(`/api/admin/calendars/${name}/events/`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const useEventList = (name: string) =>
  useQuery({
    queryKey: eventQueryKey.events(name).queryKey,
    queryFn: () => getEventList(name),
  });

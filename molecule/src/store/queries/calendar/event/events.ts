import request from "@/lib/api/request";
import { Event } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const eventQueryKey = createQueryKeys("events", {
  events: (name, params) => ["events", name, params],
});

const getEventList = async (name: string, params?: Record<string, string>) => {
  try {
    const { data } = await request.get<{ data: Event[] }>(`/api/calendars/${name}/events/`, {
      params: params,
    });

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useEventList = (name: string, params?: Record<string, string>) =>
  useQuery({
    queryKey: eventQueryKey.events(name, params).queryKey,
    queryFn: () => getEventList(name, params),
  });

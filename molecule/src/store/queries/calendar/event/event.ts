import request from "@/lib/api/request";
import { Event } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const eventQueryKey = createQueryKeys("events", {
  event: (name, id) => ["event", name, id],
});

const getEvent = async (name: string, id: string) => {
  try {
    const { data } = await request.get<{ data: Event }>(`/api/calendars/${name}/events/${id}/`);

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useEvent = (name: string, id: string) =>
  useQuery({
    queryKey: eventQueryKey.event(name, id).queryKey,
    queryFn: () => getEvent(name, id),
  });

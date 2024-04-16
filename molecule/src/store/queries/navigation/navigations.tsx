import { Navigation } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const navigationQueryKey = createQueryKeys("navigations", {
  navigations: () => ["navigations"],
});

const getNavigationList = async () => {
  try {
    const { data } = await request.get<{ data: Navigation[] }>("/api/navigations/");
    return data?.data;
  } catch (err) {
    throw err;
  }
};

export const useNavigationList = () =>
  useQuery({
    queryKey: navigationQueryKey.navigations().queryKey,
    queryFn: () => getNavigationList(),
  });

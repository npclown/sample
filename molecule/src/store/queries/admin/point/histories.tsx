import { PointHistory } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const pointQueryKey = createQueryKeys("point", {
  histories: () => ["histories"],
});

const getPointHistories = async () => {
  try {
    const { data } = await request.get<{ data: PointHistory[] }>("/api/admin/points/");
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const usePointHistories = () =>
  useQuery({
    queryKey: pointQueryKey.histories().queryKey,
    queryFn: getPointHistories,
  });

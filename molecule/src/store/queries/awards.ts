import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const awardQuerykey = createQueryKeys("user", {
  getAwardList: () => ["awardList"],
  getAward: (id: number | undefined) => ["award", id],
});

const getAwardList = async () => {
  const { data } = await request.get(`/api/awards/`);
  return data.data;
};

const getAward = async (id: number | undefined) => {
  if (!id) return;
  const { data } = await request.get(`/api/awards/${id}/`);

  return data.data;
};

export const useAwardList = () =>
  useQuery({
    queryKey: awardQuerykey.getAwardList().queryKey,
    queryFn: () => getAwardList(),
  });

export const useAward = (id: number | undefined) =>
  useQuery({
    queryKey: awardQuerykey.getAward(id).queryKey,
    queryFn: () => getAward(id),
  });

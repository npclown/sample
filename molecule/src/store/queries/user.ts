import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const userQueryKey = createQueryKeys("user", {
  check: () => ["check"],
});

const getAuthCheck = async () => {
  const { data } = await request.get("/api/auth/check/");
  return data.data;
};

export const useAuthCheck = () =>
  useQuery({
    queryKey: userQueryKey.check().queryKey,
    queryFn: getAuthCheck,
    refetchInterval: 1000 * 60 * 1,
    refetchIntervalInBackground: true,
  });

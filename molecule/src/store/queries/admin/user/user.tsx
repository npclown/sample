import { User } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const userQueryKey = createQueryKeys("user", {
  user: (userId) => ["user", userId],
});

const getUser = async (userId: User["id"]) => {
  try {
    const { data } = await request.get<{ data: User }>(`/api/admin/users/${userId}/`);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useUser = (userId: User["id"]) =>
  useQuery({
    queryKey: userQueryKey.user(userId).queryKey,
    queryFn: () => getUser(userId),
  });

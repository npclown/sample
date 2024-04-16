import { User } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const userQueryKey = createQueryKeys("user", {
  users: (page: number) => ["users", page],
});

const getUserList = async (page: number) => {
  try {
    const { data } = await request.get<Pagination<User>>(`/api/admin/users/`, {
      params: { page },
    });

    return data;
  } catch (err) {
    throw err;
  }
};

export const useUserList = (page: number) =>
  useQuery({
    queryKey: userQueryKey.users(page).queryKey,
    queryFn: () => getUserList(page),
  });

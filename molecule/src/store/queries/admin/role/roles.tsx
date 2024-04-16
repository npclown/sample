import { Role } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const roleQueryKey = createQueryKeys("role", {
  roles: () => ["roles"],
});

const getRoleList = async () => {
  try {
    const { data } = await request.get<{ data: Role[] }>("/api/admin/roles/");
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useRoleList = () =>
  useQuery({
    queryKey: roleQueryKey.roles().queryKey,
    queryFn: getRoleList,
  });

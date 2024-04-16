import { Permission } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const roleQueryKey = createQueryKeys("role", {
  permissions: () => ["permissions"],
});

const getPermissionList = async () => {
  try {
    const { data } = await request.get<{ data: Permission[] }>("/api/admin/permissions/");
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const usePermissionList = () =>
  useQuery({
    queryKey: roleQueryKey.permissions().queryKey,
    queryFn: getPermissionList,
  });

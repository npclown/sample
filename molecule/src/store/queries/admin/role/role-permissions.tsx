import { Role, RolePermission } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const roleQueryKey = createQueryKeys("role", {
  rolePermissions: (roleId) => ["rolePermissions", roleId],
});

const getRolePermissionList = async (roleId: Role["id"]) => {
  try {
    const { data } = await request.get<{ data: RolePermission[] }>(`/api/admin/roles/${roleId}/permissions/`);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useRolePermissionList = (roleId: Role["id"]) =>
  useQuery({
    queryKey: roleQueryKey.rolePermissions(roleId).queryKey,
    queryFn: () => getRolePermissionList(roleId),
  });

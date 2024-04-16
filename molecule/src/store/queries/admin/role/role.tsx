import { Role } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const roleQueryKey = createQueryKeys("role", {
  role: (mode, id) => ["role", mode, id],
});

const getRole = async (mode: "create" | "edit", id: Role["id"]) => {
  if (mode === "create") return null;

  try {
    const { data } = await request.get<{ data: Role }>(`/api/admin/roles/${id}/`);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useRole = (mode: "create" | "edit", id: Role["id"]) =>
  useQuery({
    queryKey: roleQueryKey.role(mode, id).queryKey,
    queryFn: () => getRole(mode, id),
  });

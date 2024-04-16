import { Role } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "level",
    header: "등급",
  },
];

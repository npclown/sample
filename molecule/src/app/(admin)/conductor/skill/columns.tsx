import { Skill } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Skill>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "스킬명",
  },
];

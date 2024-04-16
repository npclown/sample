import { Calendar } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Calendar>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "label",
    header: "라벨",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "order",
    header: "우선순위",
  },
];

import { Navigation } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Navigation>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "label",
    header: "라벨",
  },
  {
    accessorKey: "link",
    header: "URL",
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

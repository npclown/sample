import { BoardCategory } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<BoardCategory>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "board",
    header: "게시판",
  },
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

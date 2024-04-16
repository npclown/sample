import { Board } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Board>[] = [
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
    accessorKey: "is_main",
    header: "메인페이지 노출",
  },
  {
    accessorKey: "order",
    header: "우선순위",
  },
];

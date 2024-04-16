import { Event } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "calendar.name",
    header: "캘린더 이름",
  },
  {
    accessorKey: "start",
    header: "시작일",
  },
  {
    accessorKey: "end",
    header: "종료일",
  },
  {
    accessorKey: "title",
    header: "제목",
  },
  {
    accessorKey: "status",
    header: "승인여부",
  },
];

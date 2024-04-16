import { Banner } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "image_url",
    header: "이미지 URL",
  },
  {
    accessorKey: "title",
    header: "제목(선택)",
  },
  {
    accessorKey: "description",
    header: "설명(선택)",
  },
  {
    accessorKey: "order",
    header: "우선순위",
  },
];

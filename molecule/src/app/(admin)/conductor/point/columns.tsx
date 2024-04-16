"use client";

import { PointHistory } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PointHistory>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "email",
    header: "지급된 유저",
  },
  {
    accessorKey: "amount",
    header: "지급된 eV",
  },
  {
    accessorKey: "description",
    header: "내용",
  },
  {
    accessorKey: "created_at",
    header: "지급일",
  },
];

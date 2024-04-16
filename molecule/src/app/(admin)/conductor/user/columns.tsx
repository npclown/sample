"use client";

import { User } from "@/lib/admin/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "nickname",
    header: "닉네임",
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "profile.image_url",
    header: "프로필 사진",
  },
  {
    accessorKey: "points.point",
    header: "전체 eV",
  },
  {
    accessorKey: "created_at",
    header: "가입일",
  },
];

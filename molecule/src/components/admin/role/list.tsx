"use client";

import { columns } from "@/app/(admin)/conductor/role/columns";
import { DataTable } from "@/components/admin/data-table";
import parseError from "@/lib/api/error";
import { useRoleList } from "@/store/queries/admin/role/roles";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function RoleList() {
  const router = useRouter();

  const { data, error, refetch } = useRoleList();
  const reload = useAdminStore((state) => state.reload);

  useEffect(() => {
    refetch();
  }, [reload]);

  // @ts-ignore
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    toast.error(parseError(error).message);
    router.push("/");
    return <></>;
  }
  if (!data) {
    return <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">place skeleton here</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        handleClickRow={(row) => router.push(`/conductor/role/${row.original.id}`)}
      />
    </>
  );
}

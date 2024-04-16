"use client";

import { columns } from "@/app/(admin)/conductor/user/columns";
import { DataTable } from "@/components/admin/data-table";
import AppPagination from "@/components/common/pagination";
import parseError from "@/lib/api/error";
import { useUserList } from "@/store/queries/admin/user/users";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");
  const reload = useAdminStore((state) => state.reload);

  const { data, error, refetch } = useUserList(page);

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
      <div className="rounded-lg bg-white shadow-md dark:bg-gray-700">
        <DataTable
          columns={columns}
          data={data.data}
          handleClickRow={(row) => {
            router.push(`/conductor/user/${row.original.id}`);
          }}
        />
      </div>

      <div className="p-4">
        <AppPagination page={page} totalCount={data.count} limit={15} />
      </div>
    </>
  );
}

"use client";

import { columns } from "@/app/(admin)/conductor/board/columns";
import BoardFormDialog from "@/components/admin/board/form-dialog";
import { DataTable } from "@/components/admin/data-table";
import AppPagination from "@/components/common/pagination";
import { Board } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import { useBoardList } from "@/store/queries/admin/board/boards";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function BoardList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const { data, error, refetch } = useBoardList(page);
  const [board, setBoard] = useState<Board>();
  const reload = useAdminStore((state) => state.reload);

  const ref = useRef<{ setOpen: (state: boolean) => void }>(null);

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
            setBoard(row.original);
            ref.current!.setOpen(true);
          }}
        />
      </div>

      <div className="p-4">
        <AppPagination page={page} totalCount={data.count} limit={15} />
      </div>

      <BoardFormDialog ref={ref} mode="edit" variant="hidden" board={board} refetch={refetch} />
    </>
  );
}

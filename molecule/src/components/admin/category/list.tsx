"use client";

import { columns } from "@/app/(admin)/conductor/category/columns";
import { DataTable } from "@/components/admin/data-table";
import AppPagination from "@/components/common/pagination";
import { Board, BoardCategory } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import { useBoardCategoriesList } from "@/store/queries/admin/board/categories";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import BoardCategoryFormDialog from "./form-dialog";

export default function BoardCategoryList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const { data, error, refetch } = useBoardCategoriesList(page);
  const reload = useAdminStore((state) => state.reload);
  const [boardCategory, setBoardCategory] = useState<BoardCategory>();

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
            setBoardCategory(row.original);
            ref.current!.setOpen(true);
          }}
        />
      </div>

      <div className="p-4">
        <AppPagination page={page} limit={15} totalCount={data.count} />
      </div>

      <BoardCategoryFormDialog ref={ref} mode="edit" variant="hidden" boardCategory={boardCategory} refetch={refetch} />
    </>
  );
}

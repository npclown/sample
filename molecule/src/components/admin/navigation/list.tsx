"use client";

import { columns } from "@/app/(admin)/conductor/navigation/columns";
import { DataTable } from "@/components/admin/data-table";
import NavigationFormDialog from "@/components/admin/navigation/form-dialog";
import AppPagination from "@/components/common/pagination";
import { Navigation } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import { useNavigationList } from "@/store/queries/admin/navigation/navigations";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function NavigationList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const [navigation, setNavigation] = useState<Navigation>();
  const reload = useAdminStore((state) => state.reload);

  const { data, error, isFetched, refetch } = useNavigationList();

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
        {isFetched && (
          <DataTable
            columns={columns}
            data={data}
            handleClickRow={(row) => {
              setNavigation(row.original);
              ref.current!.setOpen(true);
            }}
          />
        )}
      </div>

      <div className="p-4">
        <AppPagination page={page} limit={15} totalCount={data.length} />
      </div>

      <NavigationFormDialog ref={ref} mode="edit" variant="hidden" navigation={navigation} refetch={refetch} />
    </>
  );
}

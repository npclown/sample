"use client";

import { columns } from "@/app/(admin)/conductor/banner/columns";
import BannerFormDialog from "@/components/admin/banner/form-dialog";
import { DataTable } from "@/components/admin/data-table";
import AppPagination from "@/components/common/pagination";
import { Banner } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import { useBannerList } from "@/store/queries/admin/banner/banners";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function BannerList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const [banner, setBanner] = useState<Banner>();
  const reload = useAdminStore((state) => state.reload);

  const { data, error, isFetched, refetch } = useBannerList();

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
              setBanner(row.original);
              ref.current!.setOpen(true);
            }}
          />
        )}
      </div>

      <div className="p-4">
        <AppPagination page={page} totalCount={data.length} limit={15} />
      </div>

      <BannerFormDialog ref={ref} mode="edit" variant="hidden" banner={banner} refetch={refetch} />
    </>
  );
}

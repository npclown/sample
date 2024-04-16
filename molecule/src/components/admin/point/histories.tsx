"use client";

import { columns } from "@/app/(admin)/conductor/point/columns";
import { DataTable } from "@/components/admin/data-table";
import parseError from "@/lib/api/error";
import { usePointHistories } from "@/store/queries/admin/point/histories";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PointHistories() {
  const router = useRouter();
  const { data, error } = usePointHistories();

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
      <DataTable columns={columns} data={data} />
    </>
  );
}

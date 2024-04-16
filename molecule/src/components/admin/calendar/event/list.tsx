"use client";

import { columns } from "@/app/(admin)/conductor/calendar/[calendar]/columns";
import EventFormDialog from "@/components/admin/calendar/event/form-dialog";
import { DataTable } from "@/components/admin/data-table";
import AppPagination from "@/components/common/pagination";
import { Event } from "@/lib/admin/definitions";
import { useEventList } from "@/store/queries/admin/calendar/event/events";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EventList({ calendar }: { calendar: string }) {
  const searchParams = useSearchParams();

  const page: number = parseInt(searchParams.get("page") ?? "1");

  const reload = useAdminStore((state) => state.reload);
  const { data, error, refetch } = useEventList(calendar);
  const [event, setEvent] = useState<Event>();

  const ref = useRef<{ setOpen: (state: boolean) => void }>(null);

  useEffect(() => {
    refetch();
  }, [reload]);

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
            setEvent(row.original);
            ref.current!.setOpen(true);
          }}
        />
      </div>

      <div className="p-4">
        <AppPagination page={page} totalCount={data.count} limit={15} />
      </div>

      <EventFormDialog ref={ref} mode="edit" variant="hidden" event={event} calendar={calendar} />
    </>
  );
}

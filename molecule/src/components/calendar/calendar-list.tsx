"use client";

import { Separator } from "@/components/ui/separator";
import type { Calendar } from "@/lib/definitions";
import { useCalendarList } from "@/store/queries/calendar/calendars";
import clsx from "clsx";
import Link from "next/link";

export default function CalendarList({ currentCalendar }: { currentCalendar: Calendar }) {
  const { data: calendars, isError, isLoading } = useCalendarList();

  if (isError || isLoading) return <></>;

  return (
    <div className="flex w-full justify-between md:text-lg xl:text-xl">
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
      {calendars?.map((calendar, index) => (
        <Link
          key={index}
          href={`/calendars/${calendar.name}`}
          className={clsx(
            "flex flex-1 cursor-pointer items-center justify-center border-b-[2px] border-r-[1px]  border-t-[1px] border-y-black bg-gray-100 dark:border-y-gray-400 dark:bg-gray-700",
            calendar.name === currentCalendar.name &&
              "border-x-[1px] border-b-0 border-t-[3px] border-x-black border-b-transparent border-t-ionblue-500 bg-white dark:border-x-gray-300 dark:border-b-gray-700",
          )}
        >
          <span>{calendar.label}</span>
        </Link>
      ))}
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
    </div>
  );
}

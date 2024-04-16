"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/lib/definitions";
import { useCalendar } from "@/store/queries/calendar/calendar";
import { useCalendarList } from "@/store/queries/calendar/calendars";
import { useEventList } from "@/store/queries/calendar/event/events";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MiniCalender() {
  const [calendar_name, setCalendarName] = useState<string>("event");

  const { data: events, isError, isFetched, refetch: eventRefetch } = useEventList(calendar_name);
  const { data: calendar, isFetched: isCalendarFetched, refetch: calendarRefetch } = useCalendar(calendar_name);
  const { data: calendars, isFetched: isCalendarListFetched } = useCalendarList();

  useEffect(() => {
    eventRefetch();
    calendarRefetch();
  }, [calendar_name, eventRefetch, calendarRefetch]);

  if (isError || !isCalendarListFetched) return <MiniCalenderSkeleton />;

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 dark:text-gray-300 xl:w-96">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-500 dark:text-gray-300 md:text-lg">일정 캘린더</h1>

        <div>
          <Select onValueChange={(value) => setCalendarName(value)}>
            <SelectTrigger className="h-[30px] w-[100px]">
              <SelectValue placeholder="행사" />
            </SelectTrigger>

            <SelectContent>
              {calendars?.map((calendar) => (
                <SelectItem key={calendar.name} value={calendar.name}>
                  {calendar.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        locale={ko}
        eventClassNames={["h-5"]}
        headerToolbar={false}
        height={300}
        dayCellContent={(e) => (e.dayNumberText = e.dayNumberText.replace("일", ""))}
        viewClassNames={["text-xs"]}
        events={events?.map((event: Event) => ({
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.color,
          extendedProps: event,
        }))}
      />

      <Link
        href={`/calendars/${calendar_name}`}
        className="w-full rounded-lg border border-gray-200 py-1 text-center text-xs transition hover:bg-gray-200 dark:hover:bg-gray-600 md:text-sm"
      >
        상세 일정 확인하기
      </Link>
    </div>
  );
}

export function MiniCalenderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 xl:w-96">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40 rounded-md bg-gray-200" />
        <Skeleton className="h-5 w-24 rounded-md bg-gray-200" />
      </div>

      <Skeleton className="h-96 w-full rounded-md bg-gray-200" />

      <Skeleton className="h-8 w-full rounded-lg bg-gray-200" />
    </div>
  );
}

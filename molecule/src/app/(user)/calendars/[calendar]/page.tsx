"use client";

import CalendarList from "@/components/calendar/calendar-list";
import EventDetailDialog from "@/components/calendar/event/detail-dialog";
import FilterForm from "@/components/calendar/filter-form";
import CalendarFormDialog from "@/components/calendar/form-dialog";
import CalendarSkeleton from "@/components/calendar/skeleton";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/lib/definitions";
import { useCalendar } from "@/store/queries/calendar/calendar";
import { useEventList } from "@/store/queries/calendar/event/events";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Page({ params }: { params: { calendar: string } }) {
  const isDesktop = useMediaQuery({ minDeviceWidth: 1280 });

  const [selected, setSelected] = useState<{ start?: Date; end?: Date }>({});
  const [event, setEvent] = useState<Event>();
  const [filters, setFilters] = useState({} as Record<string, string>);
  const keywordRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const { data: events, isError, isFetched, refetch } = useEventList(params.calendar, filters);
  const { data: calendar, isFetched: isCalendarFetched } = useCalendar(params.calendar);

  const handleSearch = () => {
    setFilters({ ...filters, search_keyword: keywordRef.current!.value });
  };

  const handleSelect = (e: DateSelectArg) => {
    setSelected({
      start: e.start,
      end: e.end,
    });
  };

  const handleOpen = (e: EventClickArg) => {
    setEvent(e.event.extendedProps as Event);
    setOpen(true);
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  useEffect(() => {
    if (isFetched) {
      refetch();
    }
  }, [isFetched, filters, refetch]);

  if (!isCalendarFetched) return <CalendarSkeleton />;

  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white p-3 shadow-md dark:bg-gray-700 md:px-10 md:py-8 xl:px-32 xl:py-12">
      {isCalendarFetched && <CalendarList currentCalendar={calendar!} />}

      {isCalendarFetched && (
        <div className="flex flex-col gap-5 md:px-5 xl:px-10">
          <FilterForm filters={filters} setFilters={setFilters} />

          <div className="relative flex items-center justify-start">
            <Input
              id="search"
              ref={keywordRef}
              onChange={debounce(handleSearch, 500)}
              className="w-full rounded-lg border-gray-600 pl-9 dark:border-gray-300 md:max-w-lg xl:max-w-xs"
              placeholder="이벤트를 검색하세요"
              type="text"
            />
            <MagnifyingGlassIcon className="absolute inset-x-0 left-2 h-6 w-6" />
          </div>
        </div>
      )}

      {open && <EventDetailDialog event={event!} open={open} setOpen={setOpen} refetch={refetch} />}

      {isFetched ? (
        <>
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin]}
            selectable={true}
            initialView="dayGridMonth"
            locale={koLocale}
            select={handleSelect}
            eventClick={handleOpen}
            eventMouseEnter={(e) => {
              e.el.style.cursor = "pointer";
            }}
            events={events?.map((event: Event) => ({
              title: event.title,
              start: event.start,
              end: event.end,
              color: event.color,
              extendedProps: event,
            }))}
          />

          {Object.keys(selected).length !== 0 && (
            <CalendarFormDialog selectedRange={selected} calendar={params.calendar} />
          )}

          {!isDesktop && (
            <CalendarFormDialog selectedRange={{ start: new Date(), end: new Date() }} calendar={params.calendar} />
          )}
        </>
      ) : (
        <Skeleton className="h-[400px] w-full md:h-[500px] xl:h-[700px]" />
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalendarList } from "@/store/queries/admin/calendar/calendars";
import Link from "next/link";

export default function CalednarDropdown() {
  const { data: calendars, isError, isFetched } = useCalendarList(1);

  if (isError || !isFetched) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">이벤트 관리</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>캘린더 이벤트 관리</DropdownMenuLabel>
        {calendars?.data.map((calendar, index) => (
          <Link key={index} href={`/conductor/calendar/${calendar.name}`}>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span>{calendar.label} 이벤트 관리</span>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

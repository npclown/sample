import CalendarDropdown from "@/components/admin/calendar/dropdown-menu";
import CalendarFormDialog from "@/components/admin/calendar/form-dialog";
import CalendarList from "@/components/admin/calendar/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import { useCalendarList } from "@/store/queries/admin/calendar/calendars";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "캘린더 목록",
  description: "캘린더 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions className="flex gap-2">
          <CalendarDropdown />
          <CalendarFormDialog />
        </HeaderActions>
      </Header>

      <CalendarList />
    </>
  );
}

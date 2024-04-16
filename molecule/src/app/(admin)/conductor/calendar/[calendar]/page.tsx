import EventFormDialog from "@/components/admin/calendar/event/form-dialog";
import EventList from "@/components/admin/calendar/event/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "캘린더 이벤트 목록",
  description: "캘린더 이벤트 목록을 관리합니다",
};

export default async function Page({ params }: { params: { calendar: string } }) {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <EventFormDialog calendar={params.calendar} />
        </HeaderActions>
      </Header>

      <EventList calendar={params.calendar} />
    </>
  );
}

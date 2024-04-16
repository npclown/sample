import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import PointHistoryHistories from "@/components/admin/point/histories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포인트 내역",
  description: "포인트 지급 내역을 확인합니다",
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>

      <div className="rounded-lg bg-white shadow-md dark:bg-gray-700">
        <PointHistoryHistories />
      </div>
    </>
  );
}

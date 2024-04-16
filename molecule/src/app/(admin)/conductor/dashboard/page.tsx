import { Header, HeaderTitle } from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "사이트의 현황을 확인합니다",
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>
    </>
  );
}

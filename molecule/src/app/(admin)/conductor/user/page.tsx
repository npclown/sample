import { Header, HeaderTitle } from "@/components/admin/header";
import UserList from "@/components/admin/user/list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원 목록",
  description: "회원 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>

      <UserList />
    </>
  );
}

import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import RoleList from "@/components/admin/role/list";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "역할 목록",
  description: "역할 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <Button asChild>
            <Link href="/conductor/role/create">역할 생성</Link>
          </Button>
        </HeaderActions>
      </Header>

      <div className="rounded-lg bg-white shadow-md dark:bg-gray-700">
        <RoleList />
      </div>
    </>
  );
}

import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import NavigationFormDialog from "@/components/admin/navigation/form-dialog";
import NavigationList from "@/components/admin/navigation/list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "네비게이션 목록",
  description: "ION 페이지의 네비게이션 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <NavigationFormDialog />
        </HeaderActions>
      </Header>

      <NavigationList />
    </>
  );
}

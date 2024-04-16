import BannerFormDialog from "@/components/admin/banner/form-dialog";
import BannerList from "@/components/admin/banner/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배너 목록",
  description: "배너 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <BannerFormDialog />
        </HeaderActions>
      </Header>

      <BannerList />
    </>
  );
}
